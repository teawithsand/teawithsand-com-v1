<?php

namespace App\Security\Voter\User;

use App\Entity\User\AppUser;
use App\Entity\User\Profile\Profile;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class ProfileVoter extends Voter
{
    protected function supports(string $attribute, $subject): bool
    {
        return in_array($attribute, [
            Profile::VOTE_CHANGE_EMAIL,
            Profile::VOTE_CONFIRM_EMAIL,
            Profile::VOTE_RESEND_EMAIL,
        ])
            && $subject instanceof Profile;
    }

    protected function voteOnAttribute(string $attribute, $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();
        if (!($user instanceof AppUser)) {
            return false;
        }

        switch ($attribute) {
            case Profile::VOTE_CHANGE_EMAIL:
            case Profile::VOTE_CONFIRM_EMAIL:
            case Profile::VOTE_RESEND_EMAIL:
                return $user->getUserProfile()->getId()->equals($subject->getId());
        }

        return false;
    }
}
