<?php

namespace App\EventSubscriber\Langka;

use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Langka\WordSet;
use App\Entity\User\AppUser;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\String\Slugger\AsciiSlugger;
use Symfony\Component\Uid\Ulid;

class WordSetSubscriber implements EventSubscriberInterface
{
    private AsciiSlugger $slugger;
    public function __construct(
        private Security $security,
    ) {
        $this->slugger = new AsciiSlugger();
    }

    public function onKernelView(ViewEvent $event)
    {
        $wordset = $event->getControllerResult();
        if (!($wordset instanceof WordSet))
            return;


        // TODO(teawithsand): actually, this should happen only during posting new one 
        //  otherwise owner shouldn't be set
        if ($wordset->getOwner() === null) {
            $user = $this->security->getUser();
            if (!($user instanceof AppUser))
                throw new \Exception("Unreachable branch; this should never happen");
            $wordset->setOwner($user->getUserProfile());
        }

        if (!$wordset->getLifecycle()->getCreatedAt()) {
            $wordset->getLifecycle()->setCreatedAt(new \DateTimeImmutable());
        }

        /*
        $wordset->setTitleSlug(
            $this->slugger->slug($wordset->getTitle())->toString() . "-" . $wordset->getId()->__toString(),
        );
        */
    }

    public static function getSubscribedEvents()
    {
        return [
            'kernel.view' => ['onKernelView', EventPriorities::PRE_WRITE],
        ];
    }
}
