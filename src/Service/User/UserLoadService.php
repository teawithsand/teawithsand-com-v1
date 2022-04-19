<?php

namespace App\Service\User;

use App\Entity\User\AppUser;
use App\Repository\User\External\FacebookUserRepository;
use App\Repository\User\Native\NativeUserRepository;
use App\Repository\User\Profile\ProfileRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Uid\Ulid;

final class UserLoadService
{
    public function __construct(
        private ProfileRepository $profileRepository,
        private NativeUserRepository $nativeUserRepository,
        private FacebookUserRepository $facebookUserRepository,
        private EntityManagerInterface $em,
    ) {
    }

    public function loadUserByProfileId(Ulid $profileId): ?AppUser
    {
        $profile = $this->profileRepository->findOneById($profileId);
        if (!$profile)
            return null;

        $nativeUser = $this->nativeUserRepository->findOneBy([
            'profile' => $profile,
        ]);
        if ($nativeUser)
            return $nativeUser;

        $facebookUser = $this->facebookUserRepository->findOneBy([
            'profile' => $profile,
        ]);
        if ($facebookUser)
            return $facebookUser;

        return null;
    }
}
