<?php

declare(strict_types=1);

namespace App\Controller\User\Native;

use App\Entity\User\Native\NativeUser;
use App\Entity\User\Native\NativeUserRegistration;
use App\Entity\User\Native\NativeUserRegistrationCreateDto;
use App\Repository\User\Native\NativeUserRegistrationRepository;
use App\Repository\User\Profile\ProfileRepository;
use App\Service\Captcha\CaptchaValidateService;
use App\Service\Email\EmailService;
use App\Service\Error\NoValueTwsApiException;
use App\Service\User\Error\NameInUseTwsApiException;
use App\Service\User\UserNonceService;
use App\Service\Validator\ValidatorService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsController]
class RegistrationCreateAction extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private MailerInterface $mailer,
        private UserPasswordHasherInterface $hasher,
        private ProfileRepository $profileRepository,
    ) {
    }

    public function __invoke(
        NativeUserRegistrationCreateDto $data,

        ValidatorService $validatorService,
        CaptchaValidateService $captchaValidateService,

        NativeUserRegistrationRepository $nativeUserRegistrationRepository,
        
        UserNonceService $userNonceService,
        EmailService $emailService,
    ): NativeUserRegistrationCreateDto {
        $captchaValidateService->validCaptchaOrThrow($data->getCaptchaResponse());
        $validatorService->validateThrow($data);

        // note: now these are not required
        $login = $data->getLogin();
        $email = $data->getEmail();
        $password = $data->getPassword();
        if (!$login || !$email || !$password)
            throw new NoValueTwsApiException();

        $profile = $this->profileRepository->findOneByPublicNameOrEmail(
            publicName: $login,
            email: $email
        );
        // TODO(teawithsand): separate handle for email
        if ($profile !== null) {
            throw new NameInUseTwsApiException("Specified profile name is already in use");
        }

        $registration = $nativeUserRegistrationRepository->findOneByLogin($login);
        if($registration !== null){
            throw new NameInUseTwsApiException("Specified profile name is already in use(but not commited yet)");
        }

        $reg = new NativeUserRegistration();

        $reg
            ->setPassword($this->hashPassword($password))
            ->setCreatedAt(new \DateTimeImmutable())
            ->setEmail($email)
            ->setLogin($login)
            ->setEmailConfirmNonce($userNonceService->generateEmailConfirmNonce());

        // TODO(teawithsand): send email here



        $this->em->persist($reg);
        $this->em->flush();

        $emailService->sendConfirmRegistrationEmail($reg);

        return $data;
    }


    private function hashPassword(string $password): string
    {
        $user = new NativeUser;
        return $this->hasher->hashPassword($user, $password);
    }
}
