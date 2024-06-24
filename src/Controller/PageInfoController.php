<?php

namespace App\Controller;

use App\Form\ContactType;
use Symfony\Component\Mime\Email;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class PageInfoController extends AbstractController
{
    #[Route('/page/info', name: 'app_page_info')]
    public function index(): Response
    {
        return $this->render('page_info/index.html.twig', [
            'controller_name' => 'PageInfoController',
        ]);
    }

    // Route pour les infos
    #[Route('/mentionsLegales', name: 'mentionsLegales')]
    public function mentionsLegales(): Response
    {
        return $this->render('pagesInfo/mentions-legales.html.twig');
    }


    #[Route('/politiqueDeConf', name: 'politiqueDeConf')]
    public function politiqueDeConf(): Response
    {
        return $this->render('pagesInfo/politique-confidentialité.html.twig');
    }


    #[Route('/termesConditions', name: 'termesConditions')]
    public function termesConditions(): Response
    {
        return $this->render('pagesInfo/termes-conditions.html.twig');
    }

    #[Route('/contacts', name: 'contacts')]
    public function contact(Request $request, MailerInterface $mailer)
    {
        $form = $this->createForm(ContactType::class);
        $form->handleRequest($request);

        if ($form->isSubmitted()) {

            //Vérifie la soumission précédente
            $session = $request->getSession();
            $lastWeirdSubmission = $session->get('last_weird_submission');
            if ($lastWeirdSubmission && (time() - $lastWeirdSubmission < 20)) {  // 20sec
                $this->addFlash('error', 'Veuillez attendre encore quelques minutes avant de réessayer.');
                return $this->redirectToRoute('app_home');
            }

            //Si le honeypot est rempli 
            if ($form->get('honeypot')->getData()) {
                //Surement un robot donc redirection et message
                $session->set('last_weird_submission', time());
                $this->addFlash('error', 'Veuillez attendre quelques minutes avant de réessayer.');
                return $this->redirectToRoute('app_home');
            }

            //Sinon on envoie 
            if ($form->isValid()) {
                $contactFormData = $form->getData();

                $email = (new Email())
                    ->from($contactFormData['email'])
                    ->to('fermeBioTest@gmail.com')
                    ->subject($contactFormData['sujet'])
                    ->text($contactFormData['message']);

                $mailer->send($email);

                $this->addFlash('success', 'Merci pour votre message, il a bien été envoyé');

                return $this->redirectToRoute('contacts');
            }   
        }

        return $this->render('pagesInfo/contacts.html.twig', [
            'contact_form' => $form->createView(),
        ]);
    }

    // #[Route('/cgv', name: 'cgv')]
    // public function cgv(): Response
    // {
    //     return $this->render('pagesInfo/cgv.html.twig');
    // }


}
