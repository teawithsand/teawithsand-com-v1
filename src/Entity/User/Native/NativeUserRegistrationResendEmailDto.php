<?php

namespace App\Entity\User\Native;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Controller\User\Native\NativeUserRegistrationResendEmailAction;
use App\Service\Captcha\ValidRecaptchaV2;
use App\Validator\ValidEncoding;
use Symfony\Component\Validator\Constraints\Email;

#[ApiResource(
    routePrefix: "v1",
    itemOperations: [
        /*
        "get" => [
            "path" => "/registrations/confirm-request/{id}",
            "controller" => NotFoundAction::class,
            "status" => 404,
            "read" => false,
            "output" => false,
        ],
        */],
    collectionOperations: [
        "post" => [
            "method" => "post",
            "path" => "/registration/resend-email",
            "controller" => NativeUserRegistrationResendEmailAction::class,
            "status" => 201,
            "read" => false,
            "output" => false,
            "write" => false,
        ]
    ],
)]
class NativeUserRegistrationResendEmailDto
{
    #[ValidEncoding()]
    private string $login = "";

    #[ValidEncoding()]
    #[Email()]
    private string $email = "";

    #[ValidRecaptchaV2()]
    private string $captchaResponse = "";

    public function getId()
    {
        return 42;
    }

    public function getCaptchaResponse(): string
    {
        return $this->captchaResponse;
    }

    public function setCaptchaResponse(string $captchaResponse): self
    {
        $this->captchaResponse = $captchaResponse;

        return $this;
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getLogin(): string
    {
        return $this->login;
    }


    public function setLogin(string $login): self
    {
        $this->login = $login;

        return $this;
    }
}
