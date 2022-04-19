<?php

namespace App\Entity\User\Native;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Controller\User\Native\NativeUserChangePasswordAction;
use App\Controller\User\Native\NativeUserResetPasswordInitAction;
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
            "path" => "/profile/native/reset-password/init",
            "controller" => NativeUserResetPasswordInitAction::class,
            "status" => 201,
            "read" => false,
            "output" => false,
            "write" => false,
        ]
    ],
)]
class NativeUserResetPasswordInitDto
{
    #[ValidEncoding()]
    private string $publicName = "";

    #[ValidEncoding()]
    #[Email()]
    private string $email = "";

    #[ValidRecaptchaV2()]
    private string $captchaResponse = "";

    public function getId()
    {
        return 42;
    }

    public function publicName(): string
    {
        return $this->publicName;
    }

    /**
     * @return self
     */
    public function setPublicName(string $profilePublicName)
    {
        $this->publicName = $profilePublicName;

        return $this;
    }

    /**
     * Get the value of profileEmail
     */
    public function getEmail(): string
    {
        return $this->email;
    }

    /**
     * Set the value of profileEmail
     *
     * @return  self
     */
    public function setEmail(string $profileEmail)
    {
        $this->email = $profileEmail;

        return $this;
    }

    /**
     * Get the value of profileEmail
     */
    public function getCaptchaResponse(): string
    {
        return $this->captchaResponse;
    }

    /**
     * Set the value of profileEmail
     *
     * @return  self
     */
    public function setCaptchaResponse(string $captchaResponse)
    {
        $this->captchaResponse = $captchaResponse;

        return $this;
    }
}
