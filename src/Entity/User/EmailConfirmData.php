<?php

declare(strict_types=1);

namespace App\Entity\User;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Embeddable]
class EmailConfirmData
{
    #[ORM\Column(type: "datetime", nullable: true)]
    private $emailConfirmedAt;

    #[ORM\Column(type: "string", length: 255, nullable: true)]
    private $emailConfirmNonce;

    public function getEmailConfirmedAt(): ?\DateTimeInterface
    {
        return $this->emailConfirmedAt;
    }

    public function setEmailConfirmedAt(?\DateTimeInterface $emailConfirmedAt): self
    {
        $this->emailConfirmedAt = $emailConfirmedAt;

        return $this;
    }

    public function getEmailConfirmNonce(): ?string
    {
        return $this->emailConfirmNonce;
    }

    public function setEmailConfirmNonce(?string $emailConfirmNonce): self
    {
        $this->emailConfirmNonce = $emailConfirmNonce;

        return $this;
    }
}
