<?php

namespace App\Security\Voter\User;

use App\Entity\User\Native\NativeUserRegistration;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class NativeUserRegistrationVoter extends Voter
{
    protected function supports(string $attribute, $subject): bool
    {
        return in_array($attribute, [
            NativeUserRegistration::VOTE_RESEND_EMAIL,
        ])
            && $subject instanceof NativeUserRegistration;
    }

    protected function voteOnAttribute(string $attribute, $subject, TokenInterface $token): bool
    {
        switch ($attribute) {
            case NativeUserRegistration::VOTE_RESEND_EMAIL:
                return true;
        }
        return false;
    }
}
