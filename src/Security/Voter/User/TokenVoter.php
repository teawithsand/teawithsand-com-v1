<?php

namespace App\Security\Voter\User;

use App\Entity\User\AppUser;
use App\Entity\User\Profile\Profile;
use App\Service\User\UserCheckService;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class TokenVoter extends Voter
{

    public function __construct(
        private UserCheckService $userCheckService,
    ) {
    }
    protected function supports(string $attribute, $subject): bool
    {
        return in_array($attribute, [
            Profile::VOTE_ISSUE_AUTH_TOKEN,
            Profile::VOTE_ISSUE_REFRESH_TOKEN,
            Profile::VOTE_REFRESH_REFRESH_TOKEN,
        ])
            && $subject instanceof AppUser;
    }

    protected function voteOnAttribute(string $attribute, $subject, TokenInterface $token): bool
    {
        if (!$subject instanceof AppUser)
            return false;
            
        switch ($attribute) {
            case Profile::VOTE_ISSUE_REFRESH_TOKEN:
            case Profile::VOTE_ISSUE_AUTH_TOKEN:
            case Profile::VOTE_REFRESH_REFRESH_TOKEN:
                return $this->userCheckService->canUserLogin($subject);
        }

        return false;
    }
}
