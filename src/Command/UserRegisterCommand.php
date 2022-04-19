<?php

namespace App\Command;

use App\Entity\User\EmailConfirmData;
use App\Entity\User\Native\NativeUser;
use App\Entity\User\Profile\Profile;
use App\Entity\User\Profile\ProfileLifecycle;
use App\Service\User\UserNonceService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsCommand(
    name: 'app:user:register',
    description: 'Registers a new user account',
)]
class UserRegisterCommand extends Command
{
    public function __construct(
        private UserPasswordHasherInterface $hasher,
        private EntityManagerInterface $em,
        private UserNonceService $userNonceService,
    ) {
        parent::__construct('app:user:register');
    }

    protected function configure(): void
    {
        $this
            ->addArgument('username', InputArgument::REQUIRED, 'Public user\'s name')
            ->addArgument('password', InputArgument::REQUIRED, 'User\'s password')
            ->addArgument('email', InputArgument::REQUIRED, 'User\'s email')
            ->addOption("admin", description: "If created user should have ROLE_ADMIN");
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $name = $input->getArgument("username");
        $email = $input->getArgument("email");
        $password = $input->getArgument("password");
        $admin = $input->hasOption("admin");

        $profile = new Profile();
        $profile
            ->setPublicName($name)
            ->setLifecycle((new ProfileLifecycle)
                    ->setCreatedAt(new \DateTimeImmutable())
            )
            ->setRoles([Profile::ROLE_USER])
            ->setEmail($email)
            ->setRefreshTokenNonce($this->userNonceService->generateRefreshTokenNonce())
            ->setEmailConfirmData((new EmailConfirmData)
                ->setEmailConfirmedAt(new \DateTimeImmutable())
                ->setEmailConfirmNonce(bin2hex(random_bytes(32))));

        if ($admin) {
            $profile->setRoles([
                ...$profile->getRoles(),
                Profile::ROLE_ADMIN,
            ]);
        }

        $user = new NativeUser();
        $user->setCreatedAt(new \DateTimeImmutable());
        $user->setProfile($profile);
        $user->setLogin($name);
        $user->setPassword($password);
        $user->setPassword(
            $this->hasher->hashPassword($user, $password)
        );

        $this->em->persist($profile);
        $this->em->persist($user);

        $id = $profile->getId();
        $io->success("Created user $name with id = $id");

        $this->em->flush();

        return Command::SUCCESS;
    }
}
