<?php

namespace App\EventListener;

use App\Service\CartService;
use Symfony\Component\HttpKernel\Event\ControllerEvent;
use Twig\Environment;

class CartListener
{
    private $cartService;
    private $twig;

    public function __construct(CartService $cartService, Environment $twig)
    {
        $this->cartService = $cartService;
        $this->twig = $twig;
    }

    public function onKernelController(ControllerEvent $event)
    {
        $this->twig->addGlobal('cart', $this->cartService->getCart());
        $this->twig->addGlobal('cartTotal', $this->cartService->getTotal());
    }
}