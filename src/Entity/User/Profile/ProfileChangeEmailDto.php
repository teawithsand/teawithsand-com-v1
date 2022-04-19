<?php

declare(strict_types=1);

namespace App\Entity\User\Profile;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Controller\User\Profile\ProfileChangeEmailAction;
use App\Validator\User\ValidEmail;
use App\Validator\ValidEncoding;
use App\Validator\ValidNotBlank;

#[ApiResource(
    routePrefix: "v1",
    collectionOperations: [],
    itemOperations: [
        "post" => [
            "method" => "post",
            "path" => "/profiles/{id}/change-email",
            "controller" => ProfileChangeEmailAction::class,
            "status" => 200,
            "read" => false,
            "output" => false,
        ]
    ]
)]
class ProfileChangeEmailDto
{
    #[ValidEmail()]
    #[ValidEncoding()]
    #[ValidNotBlank()]
    private string $email = "";

    private string $captchaResponse = "";

    public function getId(): ?int
    {
        return 42;
    }

    /**
     * Get the value of captchaResponse
     */ 
    public function getCaptchaResponse(): string
    {
        return $this->captchaResponse;
    }

    /**
     * Set the value of captchaResponse
     *
     * @return  self
     */ 
    public function setCaptchaResponse(string $captchaResponse)
    {
        $this->captchaResponse = $captchaResponse;

        return $this;
    }

    /**
     * Get the value of email
     */ 
    public function getEmail(): string
    {
        return $this->email;
    }

    /**
     * Set the value of email
     *
     * @return  self
     */ 
    public function setEmail(string $email)
    {
        $this->email = $email;

        return $this;
    }
}
