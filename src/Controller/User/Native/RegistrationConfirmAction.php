<?php

namespace App\Controller\User\Native;

use App\Entity\User\Native\NativeUserRegistration;
use App\Entity\User\Native\NativeUserRegistrationConfirmDto;
use App\Repository\User\Profile\ProfileRepository;
use App\Service\Error\NoValueTwsApiException;
use App\Service\User\Error\BadNonceTokenTwsApiException;
use App\Service\User\Error\NameInUseTwsApiException;
use App\Service\User\UserNonceService;
use App\Service\Validator\ValidatorService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpKernel\Attribute\AsController;
#[AsController]
class RegistrationConfirmAction extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private ProfileRepository $profileRepository,
    ) {
    }

    public function __invoke(
        ValidatorService $validatorService,
        NativeUserRegistration $registration,
        UserNonceService $userNonceService,
        NativeUserRegistrationConfirmDto $data
    ): NativeUserRegistrationConfirmDto {
        $validatorService->validateThrow($data);
        
        $givenNonce = $data->emailConfirmNonce;
        if (!$givenNonce)
            throw new NoValueTwsApiException("given nonce not provided");

        $nonce = $registration->getEmailConfirmNonce();
        if (!is_string($nonce) || !hash_equals($nonce, $givenNonce)) {
            throw new BadNonceTokenTwsApiException("Invalid token provided; Access denied");
        }


        $profile = $this->profileRepository->findOneByPublicNameOrEmail(
            publicName: $registration->getLogin(),
            email: $registration->getEmail(),
        );
        // TODO(teawithsand): separate exception for email
        if ($profile !== null) {
            throw new NameInUseTwsApiException("Specified profile name is already in use");
        }

        $user = $registration->makeUserAndProfile($userNonceService);

        $registrationClass = NativeUserRegistration::class;
        $this->em->beginTransaction();
        try {
            $this->em
                ->createQuery("DELETE FROM $registrationClass r WHERE r.email = :email OR r.login = :login")
                ->setParameters([
                    "email" => $registration->getEmail(),
                    "login" => $registration->getLogin(),
                ])
                ->execute();

            $this->em->remove($registration);
            $this->em->persist($user->getProfile());
            $this->em->persist($user);

            $this->em->flush();
        } catch (\Exception $e) {
            $this->em->rollback();
            throw $e;
        }

        $this->em->commit();

        return $data;
    }
}
