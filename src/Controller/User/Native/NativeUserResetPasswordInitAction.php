<?php

namespace App\Controller\User\Native;

use App\Entity\User\Native\NativeUser;
use App\Entity\User\Native\NativeUserResetPasswordInitDto;
use App\Entity\User\Profile\Profile;
use App\Repository\User\Profile\ProfileRepository;
use App\Security\Token\ApiTokenData;
use App\Security\Token\TokenIssueService;
use App\Service\Captcha\CaptchaValidateService;
use App\Service\Email\EmailService;
use App\Service\Validator\ValidatorService;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpKernel\Attribute\AsController;

#[AsController]
class NativeUserResetPasswordInitAction extends AbstractController
{
    public function __invoke(
        NativeUserResetPasswordInitDto $data,

        ValidatorService $validatorService,
        CaptchaValidateService $captchaValidateService,

        ProfileRepository $profileRepository,

        LoggerInterface $logger,
        
        EmailService $emailService,
        TokenIssueService $tokenIssueService,
    ): NativeUserResetPasswordInitDto {
        $captchaValidateService->validCaptchaOrThrow($data->getCaptchaResponse());
        $validatorService->validateThrow($data);

        /**
         * @var Profile|null
         */
        $profile = $profileRepository->findOneByEmail($data->getEmail());
        if (!$profile || !$profile->getNativeUser()) {
            $logger->info("Initating password reset for {$data->getEmail()} filed - email not found or not native user", [
                "tag" => self::class,
            ]);
            // silently ignore this try
            return $data;
        }


        $this->denyAccessUnlessGranted(NativeUser::VOTE_INIT_PASSWORD_RESET, $profile->getNativeUser());

        $tokenData = new ApiTokenData(
            nonce: $profile->getRefreshTokenNonce(),
            profileId: $profile->getId(),
            kind: ApiTokenData::KIND_RESET_PASSWORD
        );

        $token = $tokenIssueService->issueSignedApiToken($tokenData);

        $logger->info("Issued password reset token for profile {$profile->getId()->__toString()} ({$data->getEmail()})", [
            "tag" => self::class,
        ]);

        $emailService->sendPasswordResetEmail($profile, $token);

        return $data;
    }
}
