<?php

namespace App\Entity\User\Native;

use ApiPlatform\Core\Action\NotFoundAction;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Controller\User\Native\RegistrationConfirmAction;
use App\Validator\ValidEncoding;
use App\Validator\ValidNotBlank;
use Symfony\Component\Validator\Constraints as Assert;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints\NotBlank;

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
            "path" => "/registrations/{id}/confirm",
            "controller" => RegistrationConfirmAction::class,
            "status" => 201,
            "read" => false,
            "output" => false,
            "write" => false,
        ]
    ],
    collectionOperations: [
        
    ],
)]
class NativeUserRegistrationConfirmDto
{

    public function getId()
    {
        return 42;
    }

    #[ValidNotBlank()]
    #[ValidEncoding()]
    public ?string $emailConfirmNonce = null;
}