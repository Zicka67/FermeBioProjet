<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\Cart;
use App\Entity\Product;
use App\Entity\CartItem;
use App\Entity\TimeSlot;
use App\Entity\Reservation;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mime\Address;

class TimeSlotController extends AbstractController
{
    private $urlGenerator;

    public function __construct(UrlGeneratorInterface $urlGenerator)
    {
        $this->urlGenerator = $urlGenerator;
    }

    #[Route('/reserve-slot', name: 'app_reserve_slot', methods: ['POST'])]
    public function save(Request $request, EntityManagerInterface $em, SessionInterface $session, MailerInterface $mailer): JsonResponse
    {
        $content = json_decode($request->getContent(), true);
        $date = $content['date'] ?? null;
        $period = $content['period'] ?? null;
        if ($date && $period) {
            try {
                $formattedDate = \DateTime::createFromFormat('Y-m-d', $date);
                if (!$formattedDate) {
                    throw new \Exception('Invalid date format');
                }
                $timeSlot = new TimeSlot();
                $timeSlot->setDate($formattedDate);
                $timeSlot->setPeriod($period);
                $timeSlot->setAvailable(true);
                $em->persist($timeSlot);
                // Récupère l'utilisateur connecté
                $user = $this->getUser();
                // Récupère le panier de la session
                $cartData = json_decode($session->get('cart', json_encode([])), true);
                if ($cartData) {
                    $cartEntity = new Cart();
                    $cartEntity->setUser($user);
                    $cartEntity->setCreatedAt(new \DateTimeImmutable());
                    $em->persist($cartEntity);
                    foreach ($cartData as $itemData) {
                        $product = $em->getRepository(Product::class)->find($itemData['product']['id']);
                        if ($product) {
                            $cartItem = new CartItem();
                            $cartItem->setCart($cartEntity);
                            $cartItem->setProduct($product);
                            $cartItem->setQuantity($itemData['quantity']);
                            $em->persist($cartItem);
                        }
                    }
                    $reservation = new Reservation();
                    $reservation->setUser($user);
                    $reservation->setCart($cartEntity);
                    $reservation->setTimeSlot($timeSlot);
                    $reservation->setReservationDate(new \DateTime());
                    $em->persist($reservation);
                    $em->flush();
                    // Suppression du panier de la session après validation
                    $session->remove('cart');
                    // Générer l'URL de redirection
                    $redirectUrl = $this->urlGenerator->generate('reservation_success');

                    if (!$user instanceof User) {
                        throw new \LogicException('L\'utilisateur courant n\'est pas une instance de l\'entité User.');
                    }

                    // Envoi de l'email de confirmation
                    $email = (new TemplatedEmail())
                        ->from(new Address('noreply@example.com', 'Votre Boutique'))
                        ->to($user->getEmail())
                        ->subject('Confirmation de votre commande')
                        ->htmlTemplate('emails/order_confirmation.html.twig')
                        ->context([
                            'user' => $user,
                            'cart' => $cartData,
                        ]);

                    $mailer->send($email);

                    return new JsonResponse([
                        'status' => 'success',
                        'redirectUrl' => $redirectUrl
                    ]);
                }
                throw new \Exception('Cart is empty');
            } catch (\Exception $e) {
                return new JsonResponse(['status' => 'error', 'message' => $e->getMessage()], 500);
            }
        } else {
            return new JsonResponse(['status' => 'error', 'message' => 'Invalid data'], 400);
        }
    }

    #[Route('/reservation-success', name: 'reservation_success')]
    public function reservationSuccess()
    {
        return $this->render('message/reservation_success.html.twig');
    }
}
