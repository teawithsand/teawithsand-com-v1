<?php

namespace App\Entity\User\Native;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Controller\User\Native\NativeUserChangePasswordAction;
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
            "path" => "/profiles/{id}/native/change-password",
            "controller" => NativeUserChangePasswordAction::class,
            "status" => 201,
            "read" => false,
            "output" => false,
            "write" => false,
        ]
    ],
    collectionOperations: [],
)]
class NativeUserChangePasswordDto
{
    // TODO(teawithsand): rename this to password
    #[ValidNotBlank()]
    #[ValidUserPassword()]
    private string $password = "";

    public function getId(): int
    {
        return 42;
    }

    /**
     * @deprecated use password instead
     */
    public function getNewPassword(): string
    {
        return $this->password;
    }

    /**
     * @deprecated use password instead
     */
    public function setNewPassword(string $newPassword): self
    {
        $this->password = $newPassword;

        return $this;
    }


    public function getPassword(): string
    {
        return $this->password;
    }


    public function setPassword(string $newPassword): self
    {
        $this->password = $newPassword;

        return $this;
    }
}
