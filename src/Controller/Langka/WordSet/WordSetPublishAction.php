<?php

declare(strict_types=1);

namespace App\Controller\Langka\WordSet;

use App\Entity\Langka\WordSet;
use App\Entity\Langka\WordSetPublishDto;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpKernel\Attribute\AsController;

#[AsController]
class WordSetPublishAction extends AbstractController
{
    public function __invoke(
        EntityManagerInterface $em,

        WordSet $wordSet,
        WordSetPublishDto $data,
    ): WordSetPublishDto {
        if ($data->getIsPublished()) {
            $this->denyAccessUnlessGranted(WordSet::VOTE_PUBLISH, $wordSet);
        } else {
            $this->denyAccessUnlessGranted(WordSet::VOTE_UNPUBLISH, $wordSet);
        }

        if ($data->getIsPublished()) {
            $wordSet->getLifecycle()->setPublishedAt(new \DateTimeImmutable());
        } else {
            $wordSet->getLifecycle()->setPublishedAt(null);
        }

        $em->persist($wordSet);
        $em->flush();

        return $data;
    }
}
