<?php

namespace App\Entity\User\Native;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Entity\User\EmailConfirmData;
use App\Entity\User\Profile\Profile;
use App\Entity\User\Profile\ProfileLifecycle;
use App\Repository\User\Native\NativeUserRegistrationRepository;
use App\Service\User\UserNonceService;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\IdGenerator\UlidGenerator;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Uid\Ulid;

#[ORM\Entity(repositoryClass: NativeUserRegistrationRepository::class)]
#[ApiResource(
    routePrefix: "v1",
    collectionOperations: [
        "get" => [
            "path" => "/registrations",
            "security" => "is_granted('" . Profile::ROLE_TEST_OR_ADMIN . "')",
        ],

        /*
        "confirm" => [
            "status" => 200,
            "output" => false,
            "method" => "patch",
            "path" => "/registrations/{id}/confirm",
            "input" => NativeUserRegistrationConfirmRequest::class,
            "controller" => RegistrationConfirmAction::class,
        ],
        */
        /*
        "post" => [
            "output" => false,
            "status" => 200,

            // "input" => NativeUserRegistrationCreateRequest::class,
            "controller" => RegistrationCreateAction::class,
        ],
        */
    ],
    itemOperations: [
        "get" => [
            "path" => "/registrations/{id}",
            "security" => "is_granted('" . Profile::ROLE_TEST_OR_ADMIN . "')",
        ],
    ]
)]
// TODO(teawithsand): add unique index on name + email, since this is always unique
class NativeUserRegistration
{
    public const GROUP_WRITE = "nativeUserRegistration:write";

    public const VOTE_RESEND_EMAIL = "NATIVE_USER_REGISTRATION_VOTE_RESEND_EMAIL";

    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: "CUSTOM")]
    #[ORM\Column(type: 'ulid', unique: true)]
    #[ORM\CustomIdGenerator(class: UlidGenerator::class)]
    private $id;

    #[ORM\Column(type: 'string', length: 255, unique: true)]
    // #[Assert\NotBlank(message: "app.user.registration.login.error.blank")]
    #[Groups([self::GROUP_WRITE])]
    // TODO(teawithsand): define custom validator for this one
    private $login;

    #[ORM\Column(type: 'string', length: 255)]
    // #[Assert\Email(message: "app.user.registration.email.error.invalid")]
    // #[Assert\NotBlank(message: "app.user.registration.email.error.blank")]
    #[Groups([self::GROUP_WRITE])]
    private $email;

    #[ORM\Column(type: 'string', length: 255)]
    #[Groups([self::GROUP_WRITE])]
    // TODO(teawithsand): define custom validator for this one
    // TODO(teawithsand): transform it before storing in db.
    private $password;

    #[ORM\Column(type: 'datetime_immutable')]
    private $createdAt;

    #[ORM\Column(type: 'string', length: 255)]
    private string $emailConfirmNonce;

    public function getId(): ?Ulid
    {
        return $this->id;
    }

    public function getLogin(): ?string
    {
        return $this->login;
    }

    public function setLogin(string $login): self
    {
        $this->login = $login;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
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

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getEmailConfirmNonce(): ?string
    {
        return $this->emailConfirmNonce;
    }

    public function setEmailConfirmNonce(string $emailConfirmNonce): self
    {
        $this->emailConfirmNonce = $emailConfirmNonce;

        return $this;
    }

    public function makeUserAndProfile(UserNonceService $userNonceService): NativeUser
    {
        $p = new Profile;
        $p->setPublicName($this->getLogin());
        $p->setEmail($this->getEmail());
        $p->setEmailConfirmData(
            (new EmailConfirmData)
                ->setEmailConfirmedAt(new \DateTimeImmutable())
                ->setEmailConfirmNonce("")
        );
        $p->setRoles([Profile::ROLE_USER]);
        $p->setRefreshTokenNonce($userNonceService->generateRefreshTokenNonce());
        $p->setLifecycle(
            (new ProfileLifecycle())
                ->setCreatedAt(new \DateTimeImmutable())
        );

        $u = new NativeUser;
        $u->setLogin($this->getLogin());
        $u->setPassword($this->getPassword());
        $u->setProfile($p);
        $u->setCreatedAt(new \DateTimeImmutable());
        return $u;
    }
}


/*
01FT41PSCSSTCZGKN01V6Q9CQF
48d10b70ecf616a51822bf8e754f6041004e3fa564fd5313b54aedbf6cb9ca9d
*/