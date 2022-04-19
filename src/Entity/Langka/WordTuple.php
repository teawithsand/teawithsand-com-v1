<?php

namespace App\Entity\Langka;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\Langka\WordTupleRepository;
use App\Validator\ValidEncoding;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\UniqueConstraint;
use Symfony\Bridge\Doctrine\IdGenerator\UlidGenerator;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Uid\Ulid;

#[ORM\Entity(repositoryClass: WordTupleRepository::class)]
#[ORM\Table(
    uniqueConstraints: [
        new UniqueConstraint(fields: ["wordSet", "sourceWord"])
    ]
)]
#[UniqueEntity(
    fields: ["wordSet", "sourceWord"],
    message: "validator.wordtuple.not_unique",
    errorPath: "sourceWord",
)]
#[ApiResource(
    attributes: [
        "pagination_enabled" => false,
        "pagination_maximum_items_per_page" => 9999, // a lot, in fact we do not want paging for these
    ],
    routePrefix: "v1/langka/word-set",
    collectionOperations: [
        "post" => [
            "security_post_denormalize" => "is_granted('" . WordTuple::VOTE_CREATE . "', object)",
            "denormalization_context" => ['groups' => [
                WordTuple::GROUP_CREATE,
            ]],
        ],
    ],
    itemOperations: [
        "get" => [
            "security" => "is_granted('" . WordTuple::VOTE_SHOW . "', object)",
            "normalization_context" => ['groups' => [
                WordTuple::GROUP_READ,
            ]]
        ],
        "delete" => [
            "security" => "is_granted('" . WordTuple::VOTE_DELETE . "', object)",
            "output" => false,

        ],
        "put" => [
            "security" => "is_granted('" . WordTuple::VOTE_EDIT . "', object)",
            // do not allow changing wordsets
            "security_post_denormalize" => "object.getWordSet().getId().equals(previous_object.getWordSet().getId())",
            "denormalization_context" => ['groups' => [
                WordTuple::GROUP_WRITE
            ]],
            "output" => false,
        ],
    ],

    subresourceOperations: [
        'api_word_sets_word_tuples_get_subresource' => [
            'method' => 'GET',
            'normalization_context' => ['groups' => [
                WordTuple::GROUP_READ,
            ]],
        ],
    ],
)]
class WordTuple
{
    public const VOTE_CREATE = "VOTE_WORD_TUPLE_CREATE";
    public const VOTE_EDIT = "VOTE_WORD_TUPLE_EDIT";
    public const VOTE_DELETE = "VOTE_WORD_TUPLE_DELETE";
    public const VOTE_SHOW = "VOTE_WORD_TUPLE_SHOW";

    public const GROUP_CREATE = "wordtuple:create";
    public const GROUP_WRITE = "wordtuple:write";
    public const GROUP_READ = "wordtuple:read";

    /**
     * @var Ulid|null
     */
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: "CUSTOM")]
    #[ORM\Column(type: 'ulid', unique: true)]
    #[ORM\CustomIdGenerator(class: UlidGenerator::class)]
    #[Groups([self::GROUP_READ])]
    private $id;

    #[ValidEncoding()]

    #[ORM\Column(type: 'string', length: 255)]
    #[Groups([self::GROUP_READ, self::GROUP_WRITE, self::GROUP_CREATE])]
    private string $sourceWord = "";

    #[ORM\Column(type: 'text')]
    #[Groups([self::GROUP_READ, self::GROUP_WRITE, self::GROUP_CREATE])]
    private string $destinationWords = "";

    // TODO(teawithsand): for some reason api platform goes mad and returns 500 error when eager here is used, so it's commented out
    //  apparently it's bug in api platform or doctrine
    //  I will debug that and report it
    #[ORM\ManyToOne(targetEntity: WordSet::class, inversedBy: 'wordTuples'/*, fetch: "EAGER"*/)]
    #[Groups([self::GROUP_CREATE])]
    private ?WordSet $wordSet = null;

    #[ValidEncoding()]
    #[ORM\Column(type: 'text')]
    #[Groups([self::GROUP_READ, self::GROUP_WRITE, self::GROUP_CREATE])]
    private string $description = "";

    public function getId(): ?Ulid
    {
        return $this->id;
    }

    public function getSourceWord(): ?string
    {
        return $this->sourceWord;
    }

    public function setSourceWord(string $sourceWord): self
    {
        $this->sourceWord = $sourceWord;

        return $this;
    }

    public function getDestinationWords(): ?string
    {
        return $this->destinationWords;
    }

    public function setDestinationWords(string $destinationWords): self
    {
        $this->destinationWords = $destinationWords;

        return $this;
    }

    public function getWordSet(): ?WordSet
    {
        return $this->wordSet;
    }

    public function setWordSet(?WordSet $wordSet): self
    {
        $this->wordSet = $wordSet;

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
}
