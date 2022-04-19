<?php

declare(strict_types=1);

namespace App\Entity\Langka;

use DateTimeImmutable;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Embeddable]
class WordSetLifecycle
{
    /**
     * @var DateTimeImmutable
     */
    #[ORM\Column(type: "datetime_immutable", nullable: false)]
    #[Groups([
        WordSet::GROUP_PUBLIC_DETAIL,
        WordSet::GROUP_PUBLIC_SUMMARY,
    ])]
    private $createdAt;

    /**
     * @var DateTimeImmutable|null
     */
    #[ORM\Column(type: "datetime_immutable", nullable: true)]
    #[Groups([
        WordSet::GROUP_PRIVATE_DETAIL,
    ])]
    private $publishedAt;

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeInterface $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getPublishedAt(): ?\DateTimeImmutable
    {
        return $this->publishedAt;
    }

    public function setPublishedAt(?\DateTimeImmutable $publishedAt): self
    {
        $this->publishedAt = $publishedAt;

        return $this;
    }
}
