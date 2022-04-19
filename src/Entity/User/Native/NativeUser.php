<?php

namespace App\Entity\User\Native;

use App\Entity\User\AppUser;
use App\Entity\User\Profile\Profile;
use App\Repository\User\Native\NativeUserRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\IdGenerator\UlidGenerator;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Uid\Ulid;

/**
 * Native app user, one registered with good old username/password login.
 */
#[ORM\Entity(repositoryClass: NativeUserRepository::class)]
class NativeUser implements AppUser, UserInterface, PasswordAuthenticatedUserInterface
{
    public const VOTE_CHANGE_PASSWORD = "NATIVE_USER_VOTE_CHANGE_PASSWORD";
    public const VOTE_INIT_PASSWORD_RESET = "NATIVE_USER_VOTE_INIT_PASSWORD_RESET";
    public const VOTE_FINALIZE_PASSWORD_RESET = "NATIVE_USER_VOTE_FINALIZE_PASSWORD_RESET";

    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: "CUSTOM")]
    #[ORM\Column(type: 'ulid', unique: true)]
    #[ORM\CustomIdGenerator(class: UlidGenerator::class)]
    private $id;

    #[ORM\OneToOne(targetEntity: Profile::class, cascade: ['persist', 'remove'], fetch: "EAGER", inversedBy: "nativeUser")]
    #[ORM\JoinColumn(nullable: false)]
    private $profile;

    #[ORM\Column(type: 'string', length: 255, nullable: false, unique: true)]
    private $login;

    #[ORM\Column(type: 'string', length: 255)]
    private $password;

    #[ORM\Column(type: 'datetime_immutable')]
    private $createdAt;

    public function getRoles(): array
    {
        $roles = $this->getProfile()?->getRoles() ?? [];
        $roles[] = Profile::ROLE_NATIVE_USER;
        return $roles;
    }

    public function eraseCredentials(): void
    {
        $this->password = "";
    }

    public function getUserIdentifier(): string
    {
        return $this->getLogin() ?? "";
    }

    public function getUserProfile(): Profile
    {
        // this should not be null
        // it's caller responsibility to do so
        return $this->getProfile() ?? new Profile;
    }

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

    public function getProfile(): ?Profile
    {
        return $this->profile;
    }

    public function setProfile(?Profile $profile): self
    {
        $this->profile = $profile;

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
}
