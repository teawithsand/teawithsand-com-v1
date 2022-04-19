<?php

namespace App\Entity\Langka;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Controller\Langka\WordSet\WordSetPublishAction;
use App\Validator\ValidNotBlank;

#[ApiResource(
    routePrefix: "v1/langka/word-set",
    itemOperations: [
        "post" => [
            "method" => "put",
            "path" => "/{id}/publish",
            "controller" => WordSetPublishAction::class,
            "status" => 200,
            "read" => false,
            "output" => false,
            "write" => false,
        ]
    ],
    collectionOperations: [],
)]
class WordSetPublishDto
{
    private bool $isPublished = false;

    public function getId(): int
    {
        return 42;
    }

    public function getIsPublished()
    {
        return $this->isPublished;
    }

    /**
     * @return self
     */
    public function setIsPublished($isPublished): self
    {
        $this->isPublished = $isPublished;

        return $this;
    }
}
