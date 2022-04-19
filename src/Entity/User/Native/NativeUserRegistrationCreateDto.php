<?php

namespace App\Entity\User\Native;

use ApiPlatform\Core\Action\NotFoundAction;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Controller\User\Native\RegistrationCreateAction;
use App\Service\Captcha\ValidRecaptchaV2;
use App\Validator\User\ValidEmail;
use App\Validator\User\ValidUserLogin;
use App\Validator\User\ValidUserPassword;
use App\Validator\ValidEncoding;
use App\Validator\ValidNotBlank;
use Symfony\Component\Validator\Constraints as Assert;
use Doctrine\ORM\Mapping as ORM;

#[ApiResource(
    routePrefix: "v1",
    collectionOperations: [
        "post" => [
            "path" => "/registrations",
            "status" => 201,
            "controller" => RegistrationCreateAction::class,
            // "read" => false,
            "output" => false,
            // "write" => false,
        ],
    ],
    itemOperations: [
        /*
         "get" => [
            "path" => "/registrations/create-request/{id}",
            "controller" => NotFoundAction::class,
            "status" => 404,
            "read" => false,
            "output" => false,
            "write" => false,
        ]
        */],
)]
class NativeUserRegistrationCreateDto
{

    public function getId()
    {
        return 42;
    }

    /*
    #[Assert\Length(
        min: 4,
        max: 64,
    )]
    */
    #[ValidNotBlank()]
    #[ValidEncoding()]
    #[ValidUserLogin()]
    // TODO(teawithsand): define custom validator for this one
    private string $login = "";

    #[ValidEmail()]
    #[ValidNotBlank()]
    private string $email = "";

    #[ValidNotBlank()]
    #[ValidUserPassword()]
    #[ValidEncoding()]
    private string $password = "";

    #[ValidNotBlank()]
    // #[ValidRecaptchaV2()] // skip for development
    private string $captchaResponse = "";

    /**
     * Get the value of login
     */
    public function getLogin()
    {
        return $this->login;
    }

    /**
     * Set the value of login
     *
     * @return  self
     */
    public function setLogin($login)
    {
        $this->login = $login;

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

    /**
     * Get the value of password
     */
    public function getPassword()
    {
        return $this->password;
    }

    /**
     * Set the value of password
     *
     * @return  self
     */
    public function setPassword(string $password)
    {
        $this->password = $password;

        return $this;
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
}
