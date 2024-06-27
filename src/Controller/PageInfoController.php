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


    // #[Route('/cgv', name: 'cgv')]
    // public function cgv(): Response
    // {
    //     return $this->render('pagesInfo/cgv.html.twig');
    // }


}
