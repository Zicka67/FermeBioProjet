<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class ReservationController extends AbstractController
{
    #[Route('/reserve-slot', name: 'app_reserve_slot', methods: ['POST'])]
    public function reserveSlot(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        
        // Logique pour enregistrer la réservation dans la base de données
        
        // Pour cet exemple, je suppose que la réservation est toujours réussie
        return new JsonResponse(['success' => true]);
    }
}
