<?php

namespace App\Controller;

use App\Entity\Cart;
use App\Entity\User;
use App\Entity\Product;
use App\Entity\CartItem;
use Symfony\Component\Mime\Address;
use App\Repository\ProductRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class CartController extends AbstractController
{
    // #[Route('/panier', name: 'app_cart')]
    // public function showCart(SessionInterface $session): Response
    // {
    //     $cart = json_decode($session->get('cart', json_encode([])), true);

    //     $total = 0;
    //     foreach ($cart as $item) {
    //         $total += $item['product']['productPrice'] * $item['quantity'];
    //     }

    //     return $this->render('panier/index.html.twig', [
    //         'cart' => $cart,
    //         'total' => $total,
    //     ]);
    // }

    #[Route('/add-to-cart/{id}', name: 'add_to_cart')]
    public function addToCart($id, ProductRepository $productRepository, SessionInterface $session, Request $request): Response
    {
        $product = $productRepository->find($id);

        if (!$product) {
            throw $this->createNotFoundException('Le produit n\'existe pas.');
        }

        $cart = json_decode($session->get('cart', json_encode([])), true);
        $found = false;
        foreach ($cart as &$item) {
            if ($item['product']['id'] == $id) {
                $item['quantity']++;
                $found = true;
                break;
            }
        }

        if (!$found) {
            $productData = [
                'id' => $product->getId(),
                'name' => $product->getName(),
                'productPrice' => $product->getProductPrice(),
                'stock_quantity' => $product->getStockQuantity(),
                'description' => $product->getDescription(),
                'isActive' => $product->isActive(),
                'category' => $product->getCategory()->getName()
            ];
            $cartItem = [
                'product' => $productData,
                'quantity' => 1
            ];
            $cart[] = $cartItem;
        }

        $session->set('cart', json_encode($cart));

        $referer = $request->headers->get('referer');
        if ($referer) {
            return $this->redirect($referer);
        }

        return $this->redirectToRoute('app_cart');
    }

    #[Route('/increment-quantity/{id}', name: 'increment_quantity', methods: ['POST'])]
    public function incrementQuantity($id, SessionInterface $session): JsonResponse
    {
        $cart = json_decode($session->get('cart', json_encode([])), true);
        foreach ($cart as &$item) {
            if ($item['product']['id'] == $id) {
                $item['quantity']++;
                break;
            }
        }

        $session->set('cart', json_encode($cart));

        $total = array_reduce($cart, function($carry, $item) {
            return $carry + ($item['product']['productPrice'] * $item['quantity']);
        }, 0);

        return new JsonResponse(['status' => 'success', 'cart' => $cart, 'cartTotal' => $total]);
    }

    #[Route('/decrement-quantity/{id}', name: 'decrement_quantity', methods: ['POST'])]
    public function decrementQuantity($id, SessionInterface $session): JsonResponse
    {
        $cart = json_decode($session->get('cart', json_encode([])), true);
        foreach ($cart as $key => &$item) {
            if ($item['product']['id'] == $id) {
                if ($item['quantity'] > 1) {
                    $item['quantity']--;
                } else {
                    unset($cart[$key]);
                }
                break;
            }
        }

        // Re-index the array after removal
        $cart = array_values($cart);
        $session->set('cart', json_encode($cart));

        $total = array_reduce($cart, function($carry, $item) {
            return $carry + ($item['product']['productPrice'] * $item['quantity']);
        }, 0);

        return new JsonResponse(['status' => 'success', 'cart' => $cart, 'cartTotal' => $total]);
    }

    #[Route('/reset-cart', name: 'reset_cart', methods: ['POST'])]
    public function resetCart(SessionInterface $session): JsonResponse
    {
        $session->remove('cart');
        return new JsonResponse(['status' => 'success']);
    }

    #[Route('/validate-cart', name: 'validate_cart')]
    public function validateCart(SessionInterface $session, EntityManagerInterface $entityManager, MailerInterface $mailer): Response
    {
        if (!$this->getUser()) {
            $session->set('cart_before_login', $session->get('cart', json_encode([])));
            $session->set('_security.main.target_path', $this->generateUrl('validate_cart'));
            return $this->redirectToRoute('app_login'); 
        }

        $cart = json_decode($session->get('cart', json_encode([])), true);
        if ($cart) {
            $user = $this->getUser();
            
            if (!$user instanceof User) {
                throw new \LogicException('L\'utilisateur courant n\'est pas une instance de l\'entité User.');
            }

            $cartEntity = new Cart();
            $cartEntity->setUser($user);
            $cartEntity->setCreatedAt(new \DateTimeImmutable());
            $entityManager->persist($cartEntity);

            foreach ($cart as $item) {
                $cartItem = new CartItem();
                $cartItem->setCart($cartEntity);
                $cartItem->setProduct($entityManager->getRepository(Product::class)->find($item['product']['id']));
                $cartItem->setQuantity($item['quantity']);
                $entityManager->persist($cartItem);
            }

            $entityManager->flush();

            // Envoi de l'email de confirmation
            $email = (new TemplatedEmail())
                ->from(new Address('noreply@example.com', 'Votre Boutique'))
                ->to($user->getEmail())
                ->subject('Confirmation de votre commande')
                ->htmlTemplate('emails/order_confirmation.html.twig')
                ->context([
                    'user' => $user,
                    'cart' => $cart,
                ]);

            $mailer->send($email);

            // Suppression du panier de la session
            $session->remove('cart');

            // Message de confirmation
            $this->addFlash('success', 'Votre panier a bien été validé et enregistré. Un email de confirmation vous a été envoyé.');
        } else {
            $this->addFlash('info', 'Votre panier est vide.');
        }

        return $this->redirectToRoute('app_cart');
    }
}
