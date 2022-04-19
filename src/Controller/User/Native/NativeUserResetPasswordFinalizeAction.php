<?php

namespace App\Controller\User\Native;

use App\Entity\User\Native\NativeUser;
use App\Entity\User\Native\NativeUserResetPasswordFinalizeDto;
use App\Entity\User\Profile\Profile;
use App\Security\Token\ApiTokenData;
use App\Security\Token\TokenIssueService;
use App\Security\Token\TokenParseService;
use App\Service\Error\NoValueTwsApiException;
use App\Service\User\Error\BadNonceTokenTwsApiException;
use App\Service\Validator\ValidatorService;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsController]
class NativeUserResetPasswordFinalizeAction extends AbstractController
{
    public function __invoke(
        NativeUserResetPasswordFinalizeDto $data,

        Profile $profile,

        ValidatorService $validatorService,
        
        TokenParseService $tokenParseService,
        TokenIssueService $tokenIssueService,

        LoggerInterface $logger,
        UserPasswordHasherInterface $userPasswordHasherInterface,

        EntityManagerInterface $entityManagerInterface,
    ): NativeUserResetPasswordFinalizeDto {
        $validatorService->validateThrow($data);

        $token = $data->getToken();
        $newPassword = $data->getPassword();
        if (!$token || !$newPassword)
            throw new NoValueTwsApiException();

        $parsedToken = $tokenParseService->parseTokenFromString(
            kind: ApiTokenData::KIND_RESET_PASSWORD,
            token: $token
        );

        if (!hash_equals($profile->getRefreshTokenNonce(), $parsedToken->getNonce())) {
            throw new BadNonceTokenTwsApiException("Token nonce for password reset is not valid");
        }

        // but why bother using this id if it's given?
        // whatever let's leave this as is
        if (!$profile->getId()->equals($parsedToken->getProfileId())) {
            throw $this->createAccessDeniedException("Token and parameter UID mismatch");
        }

        $nativeUser = $profile->getNativeUser();
        if (!$nativeUser) {
            $logger->warning("Filed to perform password reset for profile {$profile->getId()->__toString()} since it has no native user", [
                "tag" => self::class,
            ]);
        }

        $this->denyAccessUnlessGranted(NativeUser::VOTE_FINALIZE_PASSWORD_RESET, $nativeUser);

        $nativeUser->setPassword($userPasswordHasherInterface->hashPassword($nativeUser, $newPassword));
        $profile->setRefreshTokenNonce($tokenIssueService->generateTokenNonce());

        $entityManagerInterface->persist($nativeUser);
        $entityManagerInterface->flush();

        return $data;
    }
}
