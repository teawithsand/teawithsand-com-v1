<?php

namespace App\Repository\Langka;

use App\Entity\Langka\WordTuple;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method WordTuple|null find($id, $lockMode = null, $lockVersion = null)
 * @method WordTuple|null findOneBy(array $criteria, array $orderBy = null)
 * @method WordTuple[]    findAll()
 * @method WordTuple[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class WordTupleRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, WordTuple::class);
    }

    // /**
    //  * @return WordTuple[] Returns an array of WordTuple objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('w')
            ->andWhere('w.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('w.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?WordTuple
    {
        return $this->createQueryBuilder('w')
            ->andWhere('w.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
