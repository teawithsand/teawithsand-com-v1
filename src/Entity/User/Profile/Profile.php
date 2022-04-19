<?php

namespace App\Entity\User\Profile;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Entity\User\EmailConfirmData;
use App\Entity\User\Native\NativeUser;
use App\Entity\User\SecondFactorData;
use App\Repository\User\Profile\ProfileRepository;
use App\Security\Token\ApiTokenData;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Bridge\Doctrine\IdGenerator\UlidGenerator;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Uid\Ulid;

#[ApiResource(
    routePrefix: "v1/",
    itemOperations: [
        "get" => [
            "normalization_context" => ["groups" => [
                Profile::GROUP_PUBLIC_DETAIL,
            ]]
        ],
        "get_detail" => [
            "status" => 200,
            "method" => "GET",
            "path" => "/profiles/{id}/details",
            "security" => "is_granted('" . Profile::ROLE_TEST_OR_ADMIN . "') or is_granted('" . Profile::VOTE_SHOW_PRIVATE_DETAIL . "', object)",
            "normalization_context" => ['groups' => [
                Profile::GROUP_PUBLIC_DETAIL,
                Profile::GROUP_PRIVATE_DETAIL,
            ]]
        ],
        "get_admin" => [
            "status" => 200,
            "method" => "GET",
            "path" => "/profiles/{id}/admin-details",
            "security" => "is_granted('" . Profile::ROLE_TEST_OR_ADMIN . "') or is_granted('" . Profile::VOTE_SHOW_ADMIN_DETAIL . "', object)",
            "normalization_context" => ['groups' => [
                Profile::GROUP_PUBLIC_DETAIL,
                Profile::GROUP_PRIVATE_DETAIL,
                Profile::GROUP_ADMIN_DETAIL,
            ]]
        ],
        /*
        "change_email" => [
            "status" => 200,
            "method" => "PATCH",
            "path" => "/profiles/{id}/change-email",
            #"swagger_context" => "Change profile's email address",
            # "summary" => "Change profile's email address",
            "input" => ProfileChangeEmailRequest::class,
            "controller" => ProfileChangeEmailAction::class,
            "output" => false,
        ]
        */
    ],
    collectionOperations: [
        // TODO(teawithsand): custom provider to hide users, which should not be displayed here ex. removed ones
        //  locked ones are fine until noone knows that they are locked.
        //  in fact such profile list should be (imho) removed in future.
        'get' => [
            'normalization_context' => ['groups' => [
                Profile::GROUP_PUBLIC_SUMMARY
            ]]
        ],
    ]
)]
#[ORM\Entity(repositoryClass: ProfileRepository::class)]
#[UniqueEntity(fields: "email", message: "app.user.profile.email.error.not_unique")]
class Profile
{
    // TODO(teawithsand): create special external group

    public const GROUP_ID = "profile:id";
    public const GROUP_PUBLIC_DETAIL = "profile:public:detail";
    public const GROUP_PUBLIC_SUMMARY = "profile:public:summary";
    public const GROUP_PRIVATE_DETAIL = "profile:private:detail";
    public const GROUP_PRIVATE_SUMMARY = "profile:private:summary";

    public const GROUP_ADMIN_DETAIL = "profile:admin:detail";
    public const GROUP_ADMIN_SUMMARY = "profile:admin:summary";

    public const GROUP_OWNER_WRITE = "profile:owner:write";
    public const GROUP_ADMIN_WRITE = "profile:admin:write";

    public const ROLE_USER = "ROLE_USER";
    public const ROLE_ADMIN = "ROLE_ADMIN";
    public const ROLE_TEST_OR_ADMIN = "ROLE_TEST_OR_ADMIN";
    public const ROLE_NATIVE_USER = "ROLE_NATIVE_USER";
    public const ROLE_FACEBOOK_USER = "ROLE_FACEBOOK_USER";

    public const VOTE_SHOW_ADMIN_DETAIL = "VOTE_PROFILE_SHOW_ADMIN";
    public const VOTE_SHOW_PRIVATE_DETAIL = "VOTE_PROFILE_SHOW_PRIVATE";
    public const VOTE_SHOW_PUBLIC_DETAIL = "VOTE_PROFILE_SHOW_PUBLIC";

    public const VOTE_ISSUE_AUTH_TOKEN = "VOTE_PROFILE_ISSUE_AUTH_TOKEN";
    public const VOTE_ISSUE_REFRESH_TOKEN = "VOTE_PROFILE_ISSUE_REFRESH_TOKEN";
    public const VOTE_REFRESH_REFRESH_TOKEN = "VOTE_PROFILE_REFRESH_REFRESH_TOKEN";

    public const VOTE_CHANGE_EMAIL = "VOTE_PROFILE_CHANGE_EMAIL";
    public const VOTE_CONFIRM_EMAIL = "VOTE_PROFILE_CONFIRM_EMAIL";
    public const VOTE_RESEND_EMAIL = "VOTE_PROFILE_RESEND_EMAIL";

    public const USER_KIND_NATIVE = "n";
    public const USER_KIND_FB = "fb";

    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: "CUSTOM")]
    #[ORM\Column(type: 'ulid', unique: true)]
    #[ORM\CustomIdGenerator(class: UlidGenerator::class)]
    #[Groups([
        self::GROUP_PUBLIC_SUMMARY,
        self::GROUP_PUBLIC_DETAIL,

        self::GROUP_ID,
    ])]
    private $id;

    /**
     * Note: email serves as an unique identifier. It's used for account merging when possible.
     * Note #2: account may be merged during registration. Can't register two profiles with same email.
     * 
     * @var string
     */
    #[ORM\Column(type: 'string', length: 255, nullable: true, unique: true)]
    #[Groups([
        self::GROUP_PRIVATE_SUMMARY,

        self::GROUP_ADMIN_SUMMARY,
    ])]
    private $email;

    /**
     * @var EmailConfirmData
     */
    #[Groups([
        self::GROUP_ADMIN_DETAIL,
    ])]
    #[ORM\Embedded(EmailConfirmData::class, "email_")]
    private $emailConfirmData;

    /**
     * Unique public name of specified user.
     * It's subject to changes.
     * 
     * @var string
     */
    #[ORM\Column(type: 'string', length: 255, nullable: false, unique: true)]
    #[Groups([
        self::GROUP_PUBLIC_SUMMARY,
        self::GROUP_PUBLIC_DETAIL,
    ])]
    private $publicName;

    /**
     * @var ProfileLifecycle
     */
    #[ORM\Embedded(ProfileLifecycle::class, columnPrefix: "lifecycle_")]
    #[Groups([
        self::GROUP_ADMIN_DETAIL,
    ])]
    private $lifecycle;

    /**
     * @var SecondFactorData
     */
    #[ORM\Embedded(SecondFactorData::class, columnPrefix: "second_factor_")]
    private $secondFactorData;


    /**
     * @var array<string>
     */
    #[ORM\Column(type: 'array')]
    private $roles = [];

    /**
     * TODO(teawithsand): rename it accordingly. This value is both in auth and refresh tokens for now.
     * 
     * @var string
     */
    #[ORM\Column(type: 'string', length: 64)]
    private $refreshTokenNonce;

    #[ORM\OneToOne(targetEntity: NativeUser::class, mappedBy: "profile")]
    private ?NativeUser $nativeUser = null;

    // TODO(teawithsand): add external field info here

    public function __construct()
    {
        $this->lifecycle = new ProfileLifecycle();
        $this->secondFactorData = new \App\Entity\User\SecondFactorData();
        $this->emailConfirmData = new \App\Entity\User\EmailConfirmData();
    }

    public function getApiTokenData(string $kind): ApiTokenData
    {
        return new ApiTokenData(
            kind: $kind,
            profileId: $this->getId(),
            nonce: $this->getRefreshTokenNonce(),
        );
    }

    public function getId(): ?Ulid
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(?string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getLifecycle(): ProfileLifecycle
    {
        return $this->lifecycle;
    }

    public function setLifecycle(ProfileLifecycle $lifecycle): self
    {
        $this->lifecycle = $lifecycle;

        return $this;
    }

    public function getSecondFactorData(): \App\Entity\User\SecondFactorData
    {
        return $this->secondFactorData;
    }

    public function setSecondFactorData(\App\Entity\User\SecondFactorData $secondFactorData): self
    {
        $this->secondFactorData = $secondFactorData;

        return $this;
    }

    public function getRoles(): array
    {
        if ($this->roles === null)
            return [];
        return $this->roles;
    }

    public function setRoles(array $roles): self
    {
        $this->roles = array_unique($roles);

        return $this;
    }

    public function getPublicName(): ?string
    {
        return $this->publicName;
    }

    public function setPublicName(string $publicName): self
    {
        $this->publicName = $publicName;

        return $this;
    }

    public function getEmailConfirmData(): \App\Entity\User\EmailConfirmData
    {
        return $this->emailConfirmData;
    }

    public function setEmailConfirmData(\App\Entity\User\EmailConfirmData $emailConfirmData): self
    {
        $this->emailConfirmData = $emailConfirmData;

        return $this;
    }

    public function setRefreshTokenNonce(string $refreshTokenNonce): self
    {
        $this->refreshTokenNonce = $refreshTokenNonce;

        return $this;
    }


    public function getRefreshTokenNonce(): ?string
    {
        return $this->refreshTokenNonce;
    }

    public function getNativeUser(): ?NativeUser
    {
        return $this->nativeUser;
    }

    public function setNativeUser(?NativeUser $nativeUser): self
    {
        // unset the owning side of the relation if necessary
        if ($nativeUser === null && $this->nativeUser !== null) {
            $this->nativeUser->setProfile(null);
        }

        // set the owning side of the relation if necessary
        if ($nativeUser !== null && $nativeUser->getProfile() !== $this) {
            $nativeUser->setProfile($this);
        }

        $this->nativeUser = $nativeUser;

        return $this;
    }
}
