<?php

declare(strict_types=1);

namespace App\Entity\User\Profile;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Controller\User\Profile\ProfileChangeEmailAction;
use App\Controller\User\Profile\ProfileConfirmEmailAction;
use App\Validator\User\ValidEmail;
use App\Validator\ValidEncoding;
use App\Validator\ValidNotBlank;

#[ApiResource(
    routePrefix: "v1",
    collectionOperations: [],
    itemOperations: [
        "post" => [
            "method" => "post",
            "path" => "/profiles/{id}/confirm-email",
            "controller" => ProfileConfirmEmailAction::class,
            "status" => 200,
            "read" => false,
            "output" => false,
        ]
    ]
)]
class ProfileConfirmEmailDto
{
    public function getId()
    {
        return 42;
    }

    #[ValidNotBlank()]
    #[ValidEncoding()]
    private string $emailConfirmNonce = "";

    /**
     * Get the value of emailConfirmNonce
     */ 
    public function getEmailConfirmNonce(): string
    {
        return $this->emailConfirmNonce;
    }

    /**
     * Set the value of emailConfirmNonce
     *
     * @return  self
     */ 
    public function setEmailConfirmNonce(string $emailConfirmNonce)
    {
        $this->emailConfirmNonce = $emailConfirmNonce;

        return $this;
    }
}
