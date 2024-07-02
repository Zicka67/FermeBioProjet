<?php

namespace App\Repository;

use App\Entity\DynamicText;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<DynamicText>
 *
 * @method DynamicText|null find($id, $lockMode = null, $lockVersion = null)
 * @method DynamicText|null findOneBy(array $criteria, array $orderBy = null)
 * @method DynamicText[]    findAll()
 * @method DynamicText[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class DynamicTextRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, DynamicText::class);
    }

//    /**
//     * @return DynamicText[] Returns an array of DynamicText objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('d')
//            ->andWhere('d.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('d.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?DynamicText
//    {
//        return $this->createQueryBuilder('d')
//            ->andWhere('d.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
