<?php

namespace App\Controller;

use App\Entity\DynamicText;
use App\Repository\DynamicTextRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class DynamicTextController extends AbstractController
{
    // #[Route('/', name: 'app_dynamic_text')]
    // public function index(DynamicTextRepository $dynamicTextRepository): Response
    // {

    //     $texts = $dynamicTextRepository->findAll();

    //     return $this->render('home/index.html.twig', [
    //         'controller_name' => 'DynamicTextController',
    //         'texts' => $texts
    //     ]);
    // }
}
