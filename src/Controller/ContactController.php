<?php

namespace App\Controller;

use App\Form\ContactType;
use App\Service\CartService;
use Symfony\Component\Mime\Email;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class ContactController extends AbstractController
{
    // #[Route('/contact', name: 'app_contact')]
    // public function index(): Response
    // {
    //     return $this->render('contact/index.html.twig', [
    //         'controller_name' => 'ContactController',
    //     ]);
    // }

    #[Route('/contact', name: 'contact')]
    public function contact(Request $request, MailerInterface $mailer, CartService $cartService, \Twig\Environment $twig): Response
    {
        // Récupération des données du panier et du total
        $cart = $cartService->getCart();
        $cartTotal = $cartService->getTotal();

        // Ajout des données du panier en tant que variables globales Twig
        $twig->addGlobal('cart', $cart);
        $twig->addGlobal('cartTotal', $cartTotal);

        $form = $this->createForm(ContactType::class);
        $form->handleRequest($request);

        if ($form->isSubmitted()) {
            // Vérifie la soumission précédente
            $session = $request->getSession();
            $lastWeirdSubmission = $session->get('last_weird_submission');
            if ($lastWeirdSubmission && (time() - $lastWeirdSubmission < 20)) {  // 20sec
                $this->addFlash('error', 'Veuillez attendre encore quelques minutes avant de réessayer.');
                return $this->redirectToRoute('app_home');
            }

            // Si le honeypot est rempli 
            if ($form->get('honeypot')->getData()) {
                // Sûrement un robot donc redirection et message
                $session->set('last_weird_submission', time());
                $this->addFlash('error', 'Veuillez attendre quelques minutes avant de réessayer.');
                return $this->redirectToRoute('app_home');
            }

            // Sinon on envoie 
            if ($form->isValid()) {
                $contactFormData = $form->getData();

                $email = (new Email())
                    ->from($contactFormData['email'])
                    ->to('fermeBioTest@gmail.com')
                    ->subject($contactFormData['sujet'])
                    ->text($contactFormData['message']);

                $mailer->send($email);

                $this->addFlash('success', 'Merci pour votre message, il a bien été envoyé');

                return $this->redirectToRoute('contact');
            }
        }

        return $this->render('contact/contact.html.twig', [
            'contact_form' => $form->createView(),
        ]);
    }
}
