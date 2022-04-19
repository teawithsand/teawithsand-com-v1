<?php
declare(strict_types=1);

namespace App\Entity\User;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Embeddable]
class SecondFactorData {
    #[ORM\Column(type: "string", length: 255, nullable: true)]
    private $totpSecret = null;

    public function getTotpSecret(): ?string
    {
        return $this->totpSecret;
    }

    public function setTotpSecret(?string $totpSecret): self
    {
        $this->totpSecret = $totpSecret;

        return $this;
    }
}