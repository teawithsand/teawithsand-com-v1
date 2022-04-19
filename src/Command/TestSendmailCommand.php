<?php

namespace App\Command;

use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

#[AsCommand(
    name: 'app:test:sendmail',
    description: 'Sends test email to check if email sending works',
)]
class TestSendmailCommand extends Command
{
    public function __construct(
        private MailerInterface $mailer,
    )
    {
        parent::__construct("app:test:sendmail");
    }

    protected function configure(): void
    {
        $this
            ->addArgument('destination_address', InputArgument::REQUIRED, 'Destination email address')
            ->addArgument('content', InputArgument::REQUIRED, 'Email content')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $to = $input->getArgument('destination_address');   
        $content = $input->getArgument('content');
        $io = new SymfonyStyle($input, $output);

        $email = (new Email())
            ->subject("Test mail from teawithsand.com")
            ->from("noreply@teawithsand.com")
            ->to($to)
            ->text($content);
        
        $this->mailer->send($email);

        $io->success("Mail with content $content was sent to $to");

        return Command::SUCCESS;
    }
}
