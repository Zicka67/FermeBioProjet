<?php

namespace App\Controller;

use App\Repository\ProductRepository;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class ProductController extends AbstractController
{
    // #[Route('/product', name: 'app_product')]
    // public function index(): Response
    // {
    //     return $this->render('product/index.html.twig', [
    //         'controller_name' => 'ProductController',
    //     ]);
    // }

    #[Route('/fruits', name: 'app_fruits')]
    public function showFruits(ProductRepository $productRepository): Response
    {
        // On récupère tous les produits de la catégorie "fruit"
        $fruits = $productRepository->findByCategoryId(1);

        return $this->render('product/fruits.html.twig', [
            'fruits' => $fruits,
        ]);
    }

    #[Route('/legumes', name: 'app_legumes')]
    public function showLegumes(ProductRepository $productRepository): Response
    {
        // On récupère tous les produits de la catégorie "légume"
        $legumes = $productRepository->findByCategoryId(2);
        // dd($legumes);

        return $this->render('product/legumes.html.twig', [
            'legumes' => $legumes,
        ]);
    }
}
