<?php

namespace App\Controller;

use App\Entity\TimeSlot;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class TimeSlotController extends AbstractController
{
    #[Route('/reserve-slot', name: 'app_reserve_slot', methods: ['POST'])]
    public function save(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $content = json_decode($request->getContent(), true);
        $date = $content['date'] ?? null;
        $period = $content['period'] ?? null;

        if ($date && $period) {
            try {
                $formattedDate = \DateTime::createFromFormat('Y-m-d', $date);
                if (!$formattedDate) {
                    throw new \Exception('Invalid date format');
                }

                $timeSlot = new TimeSlot();
                $timeSlot->setDate($formattedDate);
                $timeSlot->setPeriod($period);
                $timeSlot->setAvailable(true);

                $em->persist($timeSlot);
                $em->flush();

                return new JsonResponse(['status' => 'success']);
            } catch (\Exception $e) {
                return new JsonResponse(['status' => 'error', 'message' => $e->getMessage()], 500);
            }
        } else {
            return new JsonResponse(['status' => 'error', 'message' => 'Invalid data'], 400);
        }
    }
}