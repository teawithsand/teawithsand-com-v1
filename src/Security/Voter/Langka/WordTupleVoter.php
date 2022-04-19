<?php

namespace App\Security\Voter\Langka;

use App\Entity\Langka\WordSet;
use App\Entity\Langka\WordTuple;
use App\Entity\User\AppUser;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\Security;

class WordTupleVoter extends Voter
{
    public function __construct(
        private Security $security,
    ) {
    }

    protected function supports(string $attribute, $subject): bool
    {
        // replace with your own logic
        // https://symfony.com/doc/current/security/voters.html
        return in_array($attribute, [
            WordTuple::VOTE_CREATE,
            WordTuple::VOTE_DELETE,
            WordTuple::VOTE_SHOW,
            WordTuple::VOTE_EDIT,            
        ])
            && $subject instanceof WordTuple;
    }

    /**
     * @param WordTuple $subject
     */
    protected function voteOnAttribute(string $attribute, $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();
        if (!($user instanceof AppUser)) {
            $user = null;
        }

        switch ($attribute) {
            case WordTuple::VOTE_CREATE:
            case WordTuple::VOTE_DELETE:
            case WordTuple::VOTE_EDIT:
                return $user !== null && $this->security->isGranted(WordSet::VOTE_SHOW_PRIVATE_DETAIL, $subject->getWordSet());
            case WordTuple::VOTE_SHOW:
                return $this->security->isGranted(WordSet::VOTE_SHOW_PUBLIC_DETAIL, $subject->getWordSet());
        }

        return false;
    }
}
