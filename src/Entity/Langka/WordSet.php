<?php

declare(strict_types=1);

namespace App\Entity\Langka;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiSubresource;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use App\Entity\User\Profile\Profile;
use App\Repository\Langka\WordSetRepository;
use App\Validator\Langka\ValidLanguage;
use App\Validator\Langka\ValidWordSetDescription;
use App\Validator\Langka\ValidWordSetTitle;
use App\Validator\ValidEncoding;
use App\Validator\ValidNotBlank;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\IdGenerator\UlidGenerator;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Uid\Ulid;

// TODO(teawithsand): add validators for this class

#[ORM\Entity(repositoryClass: WordSetRepository::class)]
#[ApiResource(
    routePrefix: "v1/langka",
    itemOperations: [
        "get" => [
            "normalization_context" => ['groups' => [
                WordSet::GROUP_PUBLIC_DETAIL,

                WordTuple::GROUP_READ,

                Profile::GROUP_PUBLIC_SUMMARY,
            ]],
            "security" => "is_granted('" . WordSet::VOTE_SHOW_PUBLIC_DETAIL . "', object)",
        ],
        "get_details" => [
            "status" => 200,
            "method" => "GET",
            "path" => "/word-sets/{id}/details",
            "normalization_context" => ['groups' => [
                WordSet::GROUP_PUBLIC_DETAIL,
                WordSet::GROUP_PRIVATE_DETAIL,

                WordTuple::GROUP_READ,

                Profile::GROUP_PUBLIC_SUMMARY,
            ]],
            "security" => "is_granted('" . WordSet::VOTE_SHOW_PRIVATE_DETAIL . "', object)",
        ],
        "delete" => [
            "method" => "DELETE",
            "security" => "is_granted('" . WordSet::VOTE_DELETE . "', object)",
        ],
        "put" => [
            "method" => "PUT",
            "security" => "is_granted('" . WordSet::VOTE_UPDATE . "', object)",
            "denormalization_context" => ['groups' => [
                WordSet::GROUP_USER_WRITE,
            ]],
            "normalization_context" => ['groups' => [
                WordSet::GROUP_PUBLIC_DETAIL,
                WordSet::GROUP_PRIVATE_DETAIL,

                Profile::GROUP_PUBLIC_SUMMARY,
            ]],
        ]
    ],
    collectionOperations: [
        "post" => [
            "method" => "POST",
            "denormalization_context" => ['groups' => [
                self::GROUP_USER_WRITE,
            ]],
            "normalization_context" => ['groups' => [
                // return only id of create ws
                WordSet::GROUP_ID,
            ]],
        ],
        WordSet::COLLECTION_GET_PUBLIC => [
            "method" => "GET",
            "normalization_context" => ['groups' => [
                WordSet::GROUP_PUBLIC_SUMMARY,

                Profile::GROUP_PUBLIC_SUMMARY,
            ]],
            // "security" => "is_granted('" . WordSet::VOTE_SHOW_PUBLIC_DETAIL . "')",
        ],
        WordSet::COLLECTION_GET_OWNED => [
            "path" => "/word-sets/owned",
            "method" => "GET",
            "security" => "is_granted('" . Profile::ROLE_USER . "')",
            'normalization_context' => ['groups' => [
                WordSet::GROUP_PUBLIC_SUMMARY,
                WordSet::GROUP_PRIVATE_SUMMARY,

                Profile::GROUP_PUBLIC_SUMMARY,
            ]]
        ],
    ],
)]
#[ApiFilter(
    SearchFilter::class,
    properties: [
        "title" => "partial",
        "owner.publicName" => "exact",
    ],
)]
#[ApiFilter(
    OrderFilter::class,
    properties: [
        "lifecycle.createdAt" => "DESC",
        "title" => "ASC",
    ],
)]
#[UniqueEntity(
    fields: ["title"],
    message: "validator.langka.word_set.title_not_unqiue"
)]
class WordSet
{
    public const COLLECTION_GET_PUBLIC = "get_public";
    public const COLLECTION_GET_OWNED = "get_owned";

    public const GROUP_ID = "wordset:id";
    public const GROUP_PUBLIC_DETAIL = "wordset:public:detail";
    public const GROUP_PRIVATE_DETAIL = "wordset:private:detail";
    public const GROUP_ADMIN_DETAIL = "wordset:admin:detail";

    public const GROUP_USER_WRITE = "wordset:user:write";

    public const GROUP_PUBLIC_SUMMARY = "wordset:public:summary";
    public const GROUP_PRIVATE_SUMMARY = "wordset:private:summary";

    public const VOTE_SHOW_PRIVATE_DETAIL = "VOTE_WORDSET_SHOW_PRIVATE";
    public const VOTE_SHOW_PUBLIC_DETAIL = "VOTE_WORSET_SHOW_PUBLIC";
    public const VOTE_DELETE = "VOTE_WORDSET_DELETE";
    public const VOTE_UPDATE = "VOTE_WORDSET_UPDATE";

    public const VOTE_PUBLISH = "VOTE_WORDSET_PUBLISH";
    public const VOTE_UNPUBLISH = "VOTE_WORDSET_UNPUBLISH";

    // it's now on wordTuple side.
    // and in it's voter
    // public const VOTE_ADD_WORD_TUPLE = "VOTE_WORDSET_ADD_WORD_TUPLE";

    /**
     * @var Ulid|null
     */
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: "CUSTOM")]
    #[ORM\Column(type: 'ulid', unique: true)]
    #[ORM\CustomIdGenerator(class: UlidGenerator::class)]
    #[Groups([
        self::GROUP_PUBLIC_DETAIL,
        self::GROUP_PUBLIC_SUMMARY,
        self::GROUP_ID,
    ])]
    private $id;

    /**
     * @var Profile | null
     */
    #[ORM\ManyToOne(targetEntity: Profile::class, fetch: "EAGER")]
    #[Groups([
        self::GROUP_PUBLIC_DETAIL,
        self::GROUP_PUBLIC_SUMMARY,
    ])]
    private $owner;

    /**
     * @var string | null
     */
    #[ValidNotBlank()]
    #[ValidEncoding()]
    #[ValidWordSetTitle()]
    #[ORM\Column(type: 'string', length: 255, unique: true)]
    #[Groups([
        self::GROUP_PUBLIC_DETAIL,
        self::GROUP_PUBLIC_SUMMARY,

        self::GROUP_USER_WRITE,
    ])]
    private $title;

    /**
     * @var WordSetLifecycle
     */
    #[ORM\Embedded(WordSetLifecycle::class, columnPrefix: "lifecycle_")]
    #[Groups([
        self::GROUP_PUBLIC_DETAIL,
        self::GROUP_PUBLIC_SUMMARY,
    ])]
    private $lifecycle;


    /**
     * @var string
     */
    #[ValidNotBlank()]
    #[ValidLanguage()]
    #[Groups([
        self::GROUP_PUBLIC_DETAIL,
        self::GROUP_PUBLIC_SUMMARY,

        self::GROUP_USER_WRITE,
    ])]
    #[ORM\Column(type: 'string', length: 2)]
    private $sourceLanguage;

    /**
     * @var string
     */
    #[ValidNotBlank()]
    #[ValidLanguage()]
    #[Groups([
        self::GROUP_PUBLIC_DETAIL,
        self::GROUP_PUBLIC_SUMMARY,

        self::GROUP_USER_WRITE,
    ])]
    #[ORM\Column(type: 'string', length: 2)]
    private $destinationLanguage;

    #[ValidEncoding()]
    #[ValidWordSetDescription()]
    #[Groups([
        self::GROUP_PUBLIC_DETAIL,
        self::GROUP_USER_WRITE,
    ])]
    #[ORM\Column(type: 'text')]
    private $description;

    #[Groups([
        self::GROUP_PUBLIC_DETAIL,
    ])]
    #[ORM\OneToMany(mappedBy: 'wordSet', targetEntity: WordTuple::class, cascade: ["remove", "persist"])]
    #[ApiSubresource(maxDepth: 1)]
    private $wordTuples;

    public function __construct()
    {
        $this->lifecycle = new WordSetLifecycle();
        $this->wordTuples = new ArrayCollection();
    }

    public function getId(): ?Ulid
    {
        return $this->id;
    }

    /**
     * @return Collection|WordTuple[]
     */
    public function getWordTuples(): Collection
    {
        return $this->wordTuples;
    }

    public function addWordTuple(WordTuple $wordTuple): self
    {
        if (!$this->wordTuples->contains($wordTuple)) {
            $this->wordTuples[] = $wordTuple;
            $wordTuple->setWordSet($this);
        }

        return $this;
    }

    public function removeWordTuple(WordTuple $wordTuple): self
    {
        if ($this->wordTuples->removeElement($wordTuple)) {
            // set the owning side to null (unless already changed)
            if ($wordTuple->getWordSet() === $this) {
                $wordTuple->setWordSet(null);
            }
        }

        return $this;
    }

    public function getLifecycle(): WordSetLifecycle
    {
        return $this->lifecycle;
    }

    public function setLifecycle(WordSetLifecycle $lifecycle): self
    {
        $this->lifecycle = $lifecycle;

        return $this;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;

        return $this;
    }

    public function getSourceLanguage(): ?string
    {
        return $this->sourceLanguage;
    }

    public function setSourceLanguage(string $sourceLanguage): self
    {
        $this->sourceLanguage = $sourceLanguage;

        return $this;
    }

    public function getDestinationLanguage(): ?string
    {
        return $this->destinationLanguage;
    }

    public function setDestinationLanguage(string $destinationLanguage): self
    {
        $this->destinationLanguage = $destinationLanguage;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getOwner(): ?Profile
    {
        return $this->owner;
    }

    public function setOwner(?Profile $owner): self
    {
        $this->owner = $owner;

        return $this;
    }
}
