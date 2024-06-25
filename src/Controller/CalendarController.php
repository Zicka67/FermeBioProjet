<?php

namespace App\Controller;

use App\Entity\TimeSlot;
use App\Repository\TimeSlotRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class CalendarController extends AbstractController
{
    #[Route('/calendar', name: 'app_calendar')]
    public function index(Request $request, TimeSlotRepository $timeSlotRepository): Response
    {
        $currentDate = new \DateTime();
        $year = $request->query->get('year', $currentDate->format('Y'));
        $month = $request->query->get('month', $currentDate->format('m'));

        // $year et $month sont des entiers sinon ca affiche janvier 1970 et pas le jour même
        $year = (int)$year;
        $month = (int)$month;

        $firstDayOfMonth = new \DateTime("$year-$month-01");
        $lastDayOfMonth = clone $firstDayOfMonth;
        $lastDayOfMonth->modify('last day of this month');

        $timeSlots = $timeSlotRepository->findBetweenDates($firstDayOfMonth, $lastDayOfMonth);
        $calendar = $this->generateCalendarData($year, $month, $timeSlots);

        return $this->render('calendar/index.html.twig', [
            'calendar' => $calendar,
            'year' => $year,
            'month' => $month,
            'currentDate' => $firstDayOfMonth,
        ]);
    }

    private function generateCalendarData(string $year, string $month, array $timeSlots): array
    {
        $calendar = [];
        $date = new \DateTime("$year-$month-01");
        $daysInMonth = $date->format('t');

        for ($day = 1; $day <= $daysInMonth; $day++) {
            $currentDate = new \DateTime("$year-$month-$day");
            $currentDate->modify('+1 day'); // Ajouter un jour pour corriger le décalage sinon ca ne fonctionne pas

            $dayTimeSlots = array_filter($timeSlots, function($slot) use ($currentDate) {
                return $slot->getDate()->format('Y-m-d') === $currentDate->format('Y-m-d');
            });

            $calendar[] = [
                'date' => $currentDate,
                'morning' => $this->findTimeSlot($dayTimeSlots, 'morning'),
                'afternoon' => $this->findTimeSlot($dayTimeSlots, 'afternoon'),
            ];
        }

        return $calendar;
    }

    private function findTimeSlot(array $timeSlots, string $period): ?TimeSlot
    {
        foreach ($timeSlots as $slot) {
            if ($slot->getPeriod() === $period) {
                return $slot;
            }
        }
        return null;
    }
}
