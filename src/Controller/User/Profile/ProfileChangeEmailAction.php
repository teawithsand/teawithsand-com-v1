<?php

namespace App\Controller\User\Profile;

use App\Entity\User\EmailConfirmData;
use App\Entity\User\Profile\Profile;
use App\Entity\User\Profile\ProfileChangeEmailDto;
use App\Service\Captcha\CaptchaValidateService;
use App\Service\Email\EmailService;
use App\Service\User\UserNonceService;
use App\Service\Validator\ValidatorService;
use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpKernel\Attribute\AsController;
use App\Service\User\Error\EmailInUseTwsApiException;

#[AsController]
class ProfileChangeEmailAction extends AbstractController
{
    public function __invoke(
        ValidatorService $validatorService,
        UserNonceService $userNonceService,
        CaptchaValidateService $captchaValidateService,

        EmailService $emailService,

        EntityManagerInterface $em,

        Profile $profile,
        ProfileChangeEmailDto $data,
    ): ProfileChangeEmailDto {
        $validatorService->validateThrow($data);
        $captchaValidateService->validCaptchaOrThrow($data->getCaptchaResponse());
        $this->denyAccessUnlessGranted(Profile::VOTE_CHANGE_EMAIL, $profile);

        $email = $data->getEmail();

        $profile->setEmail($email);
        $profile->setEmailConfirmData(
            (new EmailConfirmData())
                ->setEmailConfirmNonce($userNonceService->generateEmailConfirmNonce())
        );

        try {
            $em->persist($profile);
            $em->flush();
        } catch (UniqueConstraintViolationException $e) {
            throw new EmailInUseTwsApiException("Cant change email to one in use", $e);
        }

        $emailService->sendEmailChangedEmail($profile);

        return $data;
    }
}
