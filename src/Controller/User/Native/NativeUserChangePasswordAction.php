<?php

namespace App\Controller\User\Native;

use App\Entity\User\Native\NativeUser;
use App\Entity\User\Native\NativeUserChangePasswordDto;
use App\Entity\User\Profile\Profile;
use App\Security\Token\TokenIssueService;
use App\Service\Error\NoValueTwsApiException;
use App\Service\User\Error\NotNativeUserTwsApiException;
use App\Service\User\UserLoadService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsController]
class NativeUserChangePasswordAction extends AbstractController
{
    public function __invoke(
        EntityManagerInterface $em,
        UserPasswordHasherInterface $hasher,
        UserLoadService $userLoadService,
        NativeUserChangePasswordDto $data,
        Profile $profile,
        TokenIssueService $tokenIssueService,
    ): NativeUserChangePasswordDto {
        $password = $data->getPassword();
        if (!$password)
            throw new NoValueTwsApiException();

        $user = $userLoadService->loadUserByProfileId($profile->getId());
        // if(!$user) // well, this should never happen unless some weird race condition is going on
        $this->denyAccessUnlessGranted(NativeUser::VOTE_CHANGE_PASSWORD, $user);

        if (!($user instanceof NativeUser)) {
            throw new NotNativeUserTwsApiException();
        }

        $user->setPassword(
            $hasher->hashPassword($user, $password),
        );

        $profile = $user->getProfile();
        $profile->setRefreshTokenNonce($tokenIssueService->generateTokenNonce());

        $em->persist($user);
        $em->flush();

        return $data;
    }
}
