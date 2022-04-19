<?php

namespace App\Controller\User\Profile;

use App\Entity\User\Profile\Profile;
use App\Entity\User\Profile\ProfileConfirmEmailDto;
use App\Entity\User\Profile\ProfileResendConfirmEmailDto;
use App\Service\Captcha\CaptchaValidateService;
use App\Service\Email\EmailService;
use App\Service\Error\TwsApiException;
use App\Service\User\Error\EmailAlreadyValidatedTwsApiException;
use App\Service\Validator\ValidatorService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpKernel\Attribute\AsController;

#[AsController]
class ProfileResendConfirmEmailAction extends AbstractController
{
    public function __invoke(
        CaptchaValidateService $captchaValidateService,
        ValidatorService $validatorService,

        EmailService $emailService,

        Profile $profile,
        ProfileResendConfirmEmailDto $data
    ): ProfileResendConfirmEmailDto {
        $validatorService->validateThrow($data);
        $captchaValidateService->validCaptchaOrThrow($data->getCaptchaResponse());

        $this->denyAccessUnlessGranted(Profile::VOTE_RESEND_EMAIL, $profile);

        if ($profile->getEmailConfirmData()->getEmailConfirmedAt() !== null) {
            throw new EmailAlreadyValidatedTwsApiException();
        }

        $emailService->sendEmailChangedEmail($profile);

        return $data;
    }
}
