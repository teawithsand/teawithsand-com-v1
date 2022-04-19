<?php
declare(strict_types=1);

namespace App\Entity\User\Profile;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Embeddable]
class ProfileLifecycle {
    #[ORM\Column(type: "datetime_immutable", nullable: false)]
    private $createdAt;

    #[ORM\Column(type: "datetime_immutable", nullable: true)]
    private $lockedAt;

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeInterface $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getLockedAt(): ?\DateTimeInterface
    {
        return $this->lockedAt;
    }

    public function setLockedAt(\DateTimeInterface $lockedAt): self
    {
        $this->lockedAt = $lockedAt;

        return $this;
    }
}