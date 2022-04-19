<?php

declare(strict_types=1);

namespace App\Security\Voter\Langka;

use App\Entity\Langka\WordSet;
use App\Entity\User\AppUser;
use App\Entity\User\Profile\Profile;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\Security;

class WordSetVoter extends Voter
{
    public function __construct(
        private Security $security,
    ) {
    }

    protected function supports(string $attribute, $subject): bool
    {
        return in_array($attribute, [
            WordSet::VOTE_UPDATE,
            WordSet::VOTE_DELETE,
            WordSet::VOTE_SHOW_PUBLIC_DETAIL,
            WordSet::VOTE_SHOW_PRIVATE_DETAIL,
            WordSet::VOTE_PUBLISH,
            WordSet::VOTE_UNPUBLISH,
        ])
            && $subject instanceof WordSet;
    }

    /**
     * @param WordSet $subject
     */
    protected function voteOnAttribute(string $attribute, $subject, TokenInterface $token): bool
    {
        if ($this->security->isGranted(Profile::ROLE_ADMIN))
            return true;
            
        // TODO(teawithsand): some is locked check here once locking is implemented.
        switch ($attribute) {
            case WordSet::VOTE_SHOW_PUBLIC_DETAIL:
                if ($subject->getLifecycle()->getPublishedAt() !== null)
                    return true;
        }

        $user = $token->getUser();
        if (!($user instanceof AppUser)) {
            $user = null;
        }

        switch ($attribute) {
            case WordSet::VOTE_PUBLISH:
            case WordSet::VOTE_UNPUBLISH:
            case WordSet::VOTE_DELETE:
            case WordSet::VOTE_UPDATE;
            case WordSet::VOTE_SHOW_PRIVATE_DETAIL:
            case WordSet::VOTE_SHOW_PUBLIC_DETAIL:
                if (!$user)
                    return false;

                return $user
                    ->getUserProfile()
                    ->getId()
                    ->equals(
                        $subject
                            ?->getOwner()
                            ?->getId()
                    );
        }

        return false;
    }
}
