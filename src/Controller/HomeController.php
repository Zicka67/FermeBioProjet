<?php

namespace App\Controller;

use App\Repository\DynamicTextRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class HomeController extends AbstractController
{
    #[Route('/', name: 'app_home')]
    public function index(DynamicTextRepository $dynamicTextRepository): Response
    {
        $dynamicTexts = $dynamicTextRepository->findAll();
   
        return $this->render('home/index.html.twig', [
            'controller_name' => 'HomeController',
            'dynamicTexts' => $dynamicTexts,
        ]);
    }
}