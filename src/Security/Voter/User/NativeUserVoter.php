<?php

namespace App\Security\Voter\User;

use App\Entity\User\AppUser;
use App\Entity\User\Native\NativeUser;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class NativeUserVoter extends Voter
{
    protected function supports(string $attribute, $subject): bool
    {
        return in_array($attribute, [
            NativeUser::VOTE_CHANGE_PASSWORD,
            NativeUser::VOTE_INIT_PASSWORD_RESET,
            NativeUser::VOTE_FINALIZE_PASSWORD_RESET,
        ])
            && $subject instanceof NativeUser;
    }

    protected function voteOnAttribute(string $attribute, $subject, TokenInterface $token): bool
    {
        // for native users info's here
        switch ($attribute) {
            case NativeUser::VOTE_INIT_PASSWORD_RESET:
                return true;
            case NativeUser::VOTE_FINALIZE_PASSWORD_RESET:
                return true;
        }

        $user = $token->getUser();
        // if the user is anonymous, do not grant access
        if (!$user instanceof AppUser) {
            return false;
        }

        // ... (check conditions and return true to grant permission) ...
        switch ($attribute) {
            case NativeUser::VOTE_CHANGE_PASSWORD:
                return $user->getUserProfile()->getId()->equals(
                    $subject->getProfile()->getId(),
                );
        }

        return false;
    }
}
