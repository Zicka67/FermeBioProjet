<?php

namespace App\Repository;

use App\Entity\TimeSlot;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class TimeSlotRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, TimeSlot::class);
    }

    public function findBetweenDates(\DateTime $start, \DateTime $end): array
    {
        return $this->createQueryBuilder('t')
            ->andWhere('t.date >= :start')
            ->andWhere('t.date <= :end')
            ->setParameter('start', $start)
            ->setParameter('end', $end)
            ->orderBy('t.date', 'ASC')
            ->getQuery()
            ->getResult();
    }
}

