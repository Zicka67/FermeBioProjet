<?php

namespace App\Controller;

use App\Entity\Cart;
use App\Entity\CartItem;
use App\Entity\Product;
use App\Repository\CartRepository;
use App\Repository\ProductRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class CartController extends AbstractController
{
    #[Route('/panier', name: 'app_cart')]
    public function showCart(SessionInterface $session, CartRepository $cartRepository): Response
    {
        $user = $this->getUser();
        if ($user) {
            $cart = $cartRepository->findOneBy(['user' => $user]);
        } else {
            $cart = json_decode($session->get('cart', json_encode([])), true);
        }

        return $this->render('panier/index.html.twig', [
            'cart' => $cart,
        ]);
    }

    #[Route('/add-to-cart/{id}', name: 'add_to_cart')]
    public function addToCart($id, ProductRepository $productRepository, SessionInterface $session, EntityManagerInterface $entityManager): Response
    {
        $product = $productRepository->find($id);

        if (!$product) {
            throw $this->createNotFoundException('Le produit n\'existe pas.');
        }

        $user = $this->getUser();
        if ($user) {
            $cart = $entityManager->getRepository(Cart::class)->findOneBy(['user' => $user]);
            if (!$cart) {
                $cart = new Cart();
                $cart->setUser($user);
                $cart->setCreatedAt(new \DateTimeImmutable());
                $entityManager->persist($cart);
                $entityManager->flush();
            }

            $cartItem = new CartItem();
            $cartItem->setCart($cart);
            $cartItem->setProduct($product);
            $cartItem->setQuantity(1); 

            $entityManager->persist($cartItem);
            $entityManager->flush();
        } else {
            $cart = json_decode($session->get('cart', json_encode([])), true);
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
            $session->set('cart', json_encode($cart));
        }

        return $this->redirectToRoute('app_cart');
    }

    #[Route('/validate-cart', name: 'validate_cart')]
    public function validateCart(SessionInterface $session, EntityManagerInterface $entityManager): Response
    {
        if (!$this->getUser()) {
            // Stocke le panier dans la session avant de rediriger vers la page de connexion
            $session->set('cart_before_login', $session->get('cart', json_encode([])));
            $session->set('target_path', $this->generateUrl('validate_cart'));
            return $this->redirectToRoute('app_login'); 
        }

        // Transfére le panier de la session à la base de données
        $cart = json_decode($session->get('cart', json_encode([])), true);
        if ($cart) {
            $user = $this->getUser();

            $cartEntity = new Cart();
            $cartEntity->setUser($user);
            $cartEntity->setCreatedAt(new \DateTimeImmutable());
            $entityManager->persist($cartEntity);
            $entityManager->flush();

            foreach ($cart as $item) {
                $cartItem = new CartItem();
                $cartItem->setCart($cartEntity);
                $cartItem->setProduct($entityManager->getRepository(Product::class)->find($item['product']['id']));
                $cartItem->setQuantity($item['quantity']);
                $entityManager->persist($cartItem);
            }

            $entityManager->flush();

            // Vide le panier de la session
            $session->remove('cart');
        }

        return $this->redirectToRoute('app_cart');
    }
}
