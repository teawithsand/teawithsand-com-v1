<?php

namespace App\Entity\User\Native;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Controller\User\Native\NativeUserChangePasswordAction;
use App\Controller\User\Native\NativeUserResetPasswordFinalizeAction;
use App\Repository\User\Native\NativeUserChangePasswordDtoRepository;
use App\Validator\User\ValidUserPassword;
use App\Validator\ValidNotBlank;
use Doctrine\ORM\Mapping as ORM;

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
        */
        "post" => [
            "method" => "post",
            "path" => "/profiles/{id}/native/reset-password/finalize",
            "controller" => NativeUserResetPasswordFinalizeAction::class,
            "status" => 201,
            "read" => false,
            "output" => false,
            "write" => false,
        ]
    ],
    collectionOperations: [],
)]
class NativeUserResetPasswordFinalizeDto
{
    // TODO(teawithsand): rename this to password
    #[ValidNotBlank()]
    #[ValidUserPassword()]
    private string $password = "";

    #[ValidNotBlank()]
    private string $token = "";

    public function getId(): int
    {
        return 42;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    public function getToken(): ?string
    {
        return $this->token;
    }

    public function setToken(string $token): self
    {
        $this->token = $token;

        return $this;
    }
}
