<?php

declare(strict_types=1);

namespace App\Validator\Langka;

use Symfony\Component\Validator\Constraint;

#[\Attribute(\Attribute::TARGET_PROPERTY | \Attribute::TARGET_METHOD | \Attribute::IS_REPEATABLE)]
class ValidWordSetDescription extends Constraint
{
    public $tooShortMessage = 'validator.langka.word_set.description.too_short';
    public $tooLongMessage = 'validator.langka.word_set.description.too_long';
    public $invalidMessage = 'validator.langka.word_set.description.invalid';

    public const TOO_SHORT_CODE = "c938402e-736d-47bb-a5e1-315549550312";
    public const TOO_LONG_CODE = "526ef20c-6b01-40af-8d49-d0a3432259ff";
    public const INVALID_CODE = "299b64f8-e32d-4078-a989-e0f1bd8ecc94";

    public function validatedBy()
    {
        return WordSetDescriptionValidator::class;
    }
}
