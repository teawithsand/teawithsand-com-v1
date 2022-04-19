<?php

declare(strict_types=1);

namespace App\Service\User;

use App\Entity\User\EmailConfirmData;
use App\Entity\User\External\FacebookUser;
use App\Entity\User\Profile\Profile;
use App\Entity\User\Profile\ProfileLifecycle;
use App\Repository\User\External\FacebookUserRepository;
use App\Repository\User\Profile\ProfileRepository;
use Doctrine\ORM\EntityManagerInterface;
use League\OAuth2\Client\Provider\Exception\IdentityProviderException;
use League\OAuth2\Client\Provider\FacebookUser as ProvidedFacebookUser;
use Symfony\Component\Uid\Ulid;

class ExternalUserService
{
    const TOKEN_TRANSFER_COOKIE_NAME = "rtt";

    public function __construct(
        private FacebookUserRepository $facebookUserRepository,
        private ProfileRepository $profileRepository,
        private EntityManagerInterface $entityManagerInterface,
    ) {
    }

    public function registerOrGetFacebookUser(ProvidedFacebookUser $providedUser): FacebookUser
    {
        $id = $providedUser->getId();
        if (!$id) {
            throw new IdentityProviderException("Facebook user has no id", 0, "");
        }

        $fbUser = $this->facebookUserRepository->findOneBy([
            'facebookId' => $id,
        ]);
        if ($fbUser)
            return $fbUser;

        $email = $providedUser->getEmail();
        $name = $providedUser->getName();
        if (!$name)
            $name = (new Ulid())->toBase32();

        $profile = $this->profileRepository->findOneBy([
            'email' => $email,
        ]);
        if (!$profile) {
            // TODO(teawithsand): abstract profile createion to external function
            $profile = new Profile;

            // assume that FB emails are confiermed
            $profile->setEmail($email);
            $profile->setEmailConfirmData(
                (new EmailConfirmData())
                    ->setEmailConfirmedAt(new \DateTimeImmutable())
                    ->setEmailConfirmNonce("")
            );

            $profile->setPublicName(
                $name . "-" . ((string) random_int(0, 1000000)),
            );

            $profile->setLifecycle(
                (new ProfileLifecycle)
                    ->setCreatedAt(new \DateTimeImmutable())
            );

            $this->entityManagerInterface->persist($profile);
        }

        $user = new FacebookUser;
        $user->setFacebookId($id);
        $user->setProfile($profile);
        $user->setCreatedAt(new \DateTimeImmutable());

        $this->entityManagerInterface->persist($user);
        $this->entityManagerInterface->flush();

        return $user;
    }
}
