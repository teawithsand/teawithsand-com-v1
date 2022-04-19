<?php
declare(strict_types=1);

namespace App\DataPersister;

use ApiPlatform\Core\DataPersister\ContextAwareDataPersisterInterface;
use App\Entity\User\Native\NativeUser;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

/**
 * Data persister, which does nothing.
 * Useful for DTO enttities.
 */
class BlankDataPersister implements ContextAwareDataPersisterInterface
{
    public function __construct(
        private EntityManagerInterface $em,
        private UserPasswordHasherInterface $hasher,
    ) {
    }
    /*
     public function __construct(
        private EntityManagerInterface $em,
        private MailerInterface $mailer,
        private UserPasswordHasherInterface $hasher,
    ) {
    }

    public function __invoke(NativeUserRegistrationCreateDto $data): void
    {
        $password = $data->password;
        $reg = new NativeUserRegistration();

        $reg
            ->setPassword($this->hashPassword($password))
            ->setCreatedAt(new \DateTimeImmutable())
            ->setEmail($data->email)
            ->setLogin($data->login)
            ->setEmailConfirmNonce(bin2hex(random_bytes(32)));

        $this->em->persist($reg);
        $this->em->flush();
    }

    */
    private function hashPassword(string $password): string
    {
        $user = new NativeUser;
        $this->hasher->hashPassword($user, $password);

        return $password;
    }


    public function supports($data, array $context = []): bool
    {
        return is_object($data) && ((bool) preg_match("/dto$/i", get_class($data)));
    }

    public function persist($data, array $context = []): void
    {
        
    }

    public function remove($data, array $context = [])
    {
        // call your persistence layer to delete $data
    }
}
