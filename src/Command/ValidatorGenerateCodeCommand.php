<?php

namespace App\Command;

use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\Uid\Uuid;

#[AsCommand(
    name: 'app:validator:generate-code',
    description: 'Generates new validation code(a UUIDv4)',
)]
class ValidatorGenerateCodeCommand extends Command
{
    protected function configure(): void
    {
        $this;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        for ($i = 0; $i < 10; $i++) {
            $uuid = Uuid::v4();
            $io->writeln($uuid->toRfc4122());
        }

        return Command::SUCCESS;
    }
}
