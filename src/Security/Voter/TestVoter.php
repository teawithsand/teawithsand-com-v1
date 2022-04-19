<?php

namespace App\Security\Voter;

use App\Entity\User\Profile\Profile;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class TestVoter extends Voter
{
    // TODO(teawithsand): make this do not work in prod
    protected function supports(string $attribute, $subject): bool
    {
        // replace with your own logic
        // https://symfony.com/doc/current/security/voters.html
        return $attribute === Profile::ROLE_TEST_OR_ADMIN;
    }

    protected function voteOnAttribute(string $attribute, $subject, TokenInterface $token): bool
    {
        if ($attribute === Profile::ROLE_TEST_OR_ADMIN) {
            return true;
        }
        return false;
    }
}
