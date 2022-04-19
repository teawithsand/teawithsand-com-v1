<?php

namespace App\Repository\User\Native;

use App\Entity\User\Native\NativeUserRegistration;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method NativeUserRegistration|null find($id, $lockMode = null, $lockVersion = null)
 * @method NativeUserRegistration|null findOneBy(array $criteria, array $orderBy = null)
 * @method NativeUserRegistration[]    findAll()
 * @method NativeUserRegistration[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class NativeUserRegistrationRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, NativeUserRegistration::class);
    }


    // /**
    //  * @return User[] Returns an array of User objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('u.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?User
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
