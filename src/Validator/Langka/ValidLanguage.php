<?php

declare(strict_types=1);

namespace App\Validator\Langka;

use Symfony\Component\Validator\Constraint;

#[\Attribute(\Attribute::TARGET_PROPERTY | \Attribute::TARGET_METHOD | \Attribute::IS_REPEATABLE)]
class ValidLanguage extends Constraint
{
    public $invalidMessage = 'validator.langka.word_set.language.invalid';

    public const INVALID_CODE = "29fc356a-0e5c-4c3a-bacf-d23ee64bfafc";

    public function validatedBy()
    {
        return LanguageValidator::class;
    }
}
