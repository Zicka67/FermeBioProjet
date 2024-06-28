<?php

namespace App\Service;

use Symfony\Component\HttpFoundation\RequestStack;

class CartService
{
    private $requestStack;

    public function __construct(RequestStack $requestStack)
    {
        $this->requestStack = $requestStack;
    }

    public function getCart(): array
    {
        $session = $this->requestStack->getSession();
        return json_decode($session->get('cart', json_encode([])), true);
    }

    public function getTotal(): float
    {
        $cart = $this->getCart();
        $total = 0;
        foreach ($cart as $item) {
            $total += $item['product']['productPrice'] * $item['quantity'];
        }
        return $total;
    }
}

