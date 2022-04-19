<?php

namespace App\Command;

use App\Entity\User\Native\NativeUser;
use App\Service\User\UserLoadService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Uid\Ulid;

#[AsCommand(
    name: 'app:user:change-password',
    description: 'Changes specified user\'s password',
)]
class UserChangePasswordCommand extends Command
{
    public function __construct(
        private UserPasswordHasherInterface $hasher,
        private EntityManagerInterface $em,
        private UserLoadService $userLoadService,
    ) {
        parent::__construct('app:user:change-password');
    }

    protected function configure(): void
    {
        $this
            ->addArgument('id', InputArgument::REQUIRED, 'User\'s id')
            ->addArgument('newPassword', InputArgument::REQUIRED, 'User\'s password')
            ->addOption("admin", description: "If created user should have ROLE_ADMIN");
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $id = $input->getArgument("id");
        $newPassword = $input->getArgument("newPassword");

        $user = $this->userLoadService->loadUserByProfileId(new Ulid($id));
        if (!($user instanceof NativeUser)) {
            $io->error("User is not native user");
            return Command::FAILURE;
        }

        $user->setPassword(
            $this->hasher->hashPassword($user, $newPassword)
        );

        $this->em->persist($user);
        $this->em->flush();

        $io->success("Changed user's $id password (username {$user->getUserProfile()->getPublicName()})");

        return Command::SUCCESS;
    }
}
