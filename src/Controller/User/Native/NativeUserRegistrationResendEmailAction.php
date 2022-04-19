<?php

namespace App\Controller\User\Native;

use App\Entity\User\Native\NativeUserRegistration;
use App\Entity\User\Native\NativeUserRegistrationResendEmailDto;
use App\Repository\User\Native\NativeUserRegistrationRepository;
use App\Service\Captcha\CaptchaValidateService;
use App\Service\Email\EmailService;
use App\Service\User\Error\NoSuchRegistrationForResendTwsApiException;
use App\Service\Validator\ValidatorService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpKernel\Attribute\AsController;

#[AsController]
class NativeUserRegistrationResendEmailAction extends AbstractController
{
    public function __invoke(
        NativeUserRegistrationResendEmailDto $data,

        ValidatorService $validatorService,
        CaptchaValidateService $captchaValidateService,

        NativeUserRegistrationRepository $nativeUserRegistrationRepository,

        EmailService $emailService,
    ): NativeUserRegistrationResendEmailDto {
        $captchaValidateService->validCaptchaOrThrow($data->getCaptchaResponse());
        $validatorService->validateThrow($validatorService);

        $registration = $nativeUserRegistrationRepository->findOneBy([
            'email' => $data->getEmail(),
            'login' => $data->getLogin(),
        ]);

        if (!$registration)
            throw new NoSuchRegistrationForResendTwsApiException("Not found valid registration for email {$data->getEmail()} and login {$data->getLogin()}");

        $this->denyAccessUnlessGranted(NativeUserRegistration::VOTE_RESEND_EMAIL, $registration);

        $emailService->sendConfirmRegistrationEmail(
            $registration
        );

        return $data;
    }
}
