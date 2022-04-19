<?php

declare(strict_types=1);

namespace App\Service\Email;

use App\Entity\User\Native\NativeUserRegistration;
use App\Entity\User\Profile\Profile;
use Psr\Log\LoggerInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\Envelope;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\RawMessage;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\Mime\Address;
use Symfony\Component\Routing\Generator\UrlGenerator;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

// TODO(teawithsand): add custom exception on email send failure, so it can be pretty-explained

class EmailService
{
    const REPLY_TO_ADDRESS = "admin@teawithsand.com";
    
    public function __construct(
        private MailerInterface $mailer,
        // TODO(teawithsand): load parameters from this bag rather than use constants
        private ParameterBagInterface $parameterBag,
        private TranslatorInterface $translator,
        private UrlGeneratorInterface $urlGeneratorInterface,
        private LoggerInterface $logger,
    ) {
    }

    private function sendEmail(RawMessage $message, ?Envelope $envelope = null): void
    {
        $this->mailer->send($message, $envelope);
    }

    public function sendConfirmRegistrationEmail(NativeUserRegistration $registration): void
    {
        $email = (new TemplatedEmail)
            // TODO(teawithsand): make first part subjec to translation
            ->from(Address::create("teawithsand.com registration <noreply@teawithsand.com>"))
            ->to($registration->getEmail())
            ->replyTo(self::REPLY_TO_ADDRESS)
            ->subject($this->translator->trans("email.register.title"))
            ->htmlTemplate("email/registration.html.twig")
            ->context([
                'registartion' => $registration,
                'login' => $registration->getLogin(),
                'id' => $registration->getId()->__toString(),
                'url' => $this->urlGeneratorInterface->generate('app_user_confirm_registration', [
                    "id" => $registration->getId()->__toString(),
                    "token" => $registration->getEmailConfirmNonce(),
                ], UrlGenerator::ABSOLUTE_URL)
            ]);

        try {
            $this->mailer->send($email);
        } catch (\Exception $e) {
            $this->logger->warning("Sending email filed", [
                "exception" => $e,
                "tag" => self::class,
                "target" => $registration->getEmail(),
                "cause" => "registration",
            ]);
            throw $e;
        }

        $this->logger->warning("Sent email", [
            "tag" => self::class,
            "target" => $registration->getEmail(),
            "cause" => "registration",
        ]);
    }

    public function sendPasswordResetEmail(Profile $profile, string $token): void
    {
        $email = (new TemplatedEmail)
            ->from(Address::create("teawithsand.com password reset <noreply@teawithsand.com>"))
            ->to($profile->getEmail())
            ->replyTo(self::REPLY_TO_ADDRESS)
            ->subject($this->translator->trans("email.register.title"))
            ->htmlTemplate("email/password_reset.html.twig")
            ->context([
                'profile' => $profile,
                'publicName' => $profile->getPublicName(),
                "token" => $token,
                'url' => $this->urlGeneratorInterface->generate('app_user_reset_password_finalize', [
                    "id" => $profile->getId()->__toString(),
                    "token" => $token,
                ], UrlGenerator::ABSOLUTE_URL)
            ]);

        try {
            $this->mailer->send($email);
        } catch (\Exception $e) {
            $this->logger->warning("Sending email filed", [
                "exception" => $e,
                "tag" => self::class,
                "target" => $profile->getEmail(),
                "cause" => "password_reset",
            ]);
            throw $e;
        }

        $this->logger->warning("Sent email", [
            "tag" => self::class,
            "target" => $profile->getEmail(),
            "cause" => "password_reset",
        ]);
    }

    public function sendEmailChangedEmail(Profile $profile): void
    {
        $email = (new TemplatedEmail)
            // TODO(teawithsand): make first part subjec to translation
            ->from(Address::create("teawithsand.com email changed <noreply@teawithsand.com>"))
            ->to($profile->getEmail())
            ->replyTo(self::REPLY_TO_ADDRESS)
            ->subject($this->translator->trans("email.changed_email.title"))
            ->htmlTemplate("email/changed_email.html.twig")
            ->context([
                'profile' => $profile,
                'login' => $profile->getPublicName(),
                'emailConfirmData' => $profile->getEmailConfirmData(),
                'id' => $profile->getId()->__toString(),
                'url' => $this->urlGeneratorInterface->generate('app_user_change_email_finalize', [
                    "id" => $profile->getId()->__toString(),
                    "token" => $profile->getEmailConfirmData()->getEmailConfirmNonce(),
                ], UrlGenerator::ABSOLUTE_URL)
            ]);

        try {
            $this->mailer->send($email);
        } catch (\Exception $e) {
            $this->logger->warning("Sending email filed", [
                "exception" => $e,
                "tag" => self::class,
                "target" => $profile->getEmail(),
                "cause" => "registration",
            ]);
            throw $e;
        }

        $this->logger->warning("Sent email", [
            "tag" => self::class,
            "target" => $profile->getEmail(),
            "cause" => "new_email",
        ]);
    }
}
