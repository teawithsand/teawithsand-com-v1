<?php

namespace App\Controller\User\Profile;

use App\Entity\User\Profile\Profile;
use App\Entity\User\Profile\ProfileConfirmEmailDto;
use App\Service\Error\TwsApiException;
use App\Service\User\Error\BadNonceTokenTwsApiException;
use App\Service\User\Error\EmailAlreadyValidatedTwsApiException;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpKernel\Attribute\AsController;

#[AsController]
class ProfileConfirmEmailAction extends AbstractController
{
    public function __invoke(
        EntityManagerInterface $em,

        Profile $profile,
        ProfileConfirmEmailDto $data
    ): ProfileConfirmEmailDto {
        $this->denyAccessUnlessGranted(Profile::VOTE_CONFIRM_EMAIL, $profile);

        if ($profile->getEmailConfirmData()->getEmailConfirmedAt() !== null)
            throw new EmailAlreadyValidatedTwsApiException();

        $givenNonce = $data->getEmailConfirmNonce();
        $nonce = $profile->getEmailConfirmData()->getEmailConfirmNonce();
        if (!is_string($nonce) || !hash_equals($nonce, $givenNonce)) {
            throw new BadNonceTokenTwsApiException("Invalid token provided; Access denied");
        }

        $profile
            ->getEmailConfirmData()
            ->setEmailConfirmedAt(new \DateTimeImmutable());

        $em->persist($profile);

        return $data;
    }
}
