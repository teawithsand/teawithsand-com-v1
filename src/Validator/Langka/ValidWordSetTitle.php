<?php

declare(strict_types=1);

namespace App\Validator\Langka;

use Symfony\Component\Validator\Constraint;

#[\Attribute(\Attribute::TARGET_PROPERTY | \Attribute::TARGET_METHOD | \Attribute::IS_REPEATABLE)]
class ValidWordSetTitle extends Constraint
{
    public $tooShortMessage = 'validator.langka.word_set.title.too_short';
    public $tooLongMessage = 'validator.langka.word_set.title.too_long';
    public $invalidMessage = 'validator.langka.word_set.title.invalid';

    public const TOO_SHORT_CODE = " 3a3afb49-f172-41d3-ba42-a290db346bf2";
    public const TOO_LONG_CODE = "2ff55d05-aa9c-433d-b406-4c97c438cff9";
    public const INVALID_CODE = "31df898f-d061-4ab1-8fe1-c1f37ac18138";

    public function validatedBy()
    {
        return WordSetTitleValidator::class;
    }
}
