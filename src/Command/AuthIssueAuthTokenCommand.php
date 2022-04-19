<?php

namespace App\Command;

use App\Repository\User\Profile\ProfileRepository;
use App\Security\JWTConfig;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\Uid\Ulid;

#[AsCommand(
    name: 'app:auth:issue-auth-token',
    description: 'Add a short description for your command',
)]
class AuthIssueAuthTokenCommand extends Command
{
    public function __construct(
        private JWTConfig $config,
        private ProfileRepository $repository,
    ) {
        parent::__construct("app:auth:issue-auth-token");
    }

    protected function configure(): void
    {
        $this
            ->addArgument('uid', InputArgument::OPTIONAL, 'Profile id to use');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $arg1 = $input->getArgument('uid');

        $profile = $this->repository->findOneById(new Ulid($arg1));
        $token = $this->config->issueAuthTokenForProfile($profile);

        $io->success("$token");

        return Command::SUCCESS;
    }
}
