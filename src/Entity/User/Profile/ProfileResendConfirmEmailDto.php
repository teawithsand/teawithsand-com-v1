<?php

declare(strict_types=1);

namespace App\Entity\User\Profile;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Controller\User\Profile\ProfileResendConfirmEmailAction;

#[ApiResource(
    routePrefix: "v1",
    collectionOperations: [],
    itemOperations: [
        "post" => [
            "method" => "post",
            "path" => "/profiles/{id}/resend-confirm-email",
            "controller" => ProfileResendConfirmEmailAction::class,
            "status" => 200,
            "read" => false,
            "output" => false,
        ]
    ]
)]
class ProfileResendConfirmEmailDto
{
    private string $captchaResponse;

    public function getId(): ?int
    {
        return 42;
    }
    /**
     * Get the value of captchaResponse
     */ 
    public function getCaptchaResponse()
    {
        return $this->captchaResponse;
    }

    /**
     * Set the value of captchaResponse
     *
     * @return  self
     */ 
    public function setCaptchaResponse($captchaResponse)
    {
        $this->captchaResponse = $captchaResponse;

        return $this;
    }
}
