<?php
declare(strict_types=1);

namespace App\Validator;

use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\NotBlankValidator;

#[\Attribute(\Attribute::TARGET_PROPERTY | \Attribute::TARGET_METHOD | \Attribute::IS_REPEATABLE)]
class ValidNotBlank extends NotBlank
{
    public $message = 'validator.common.not_blank';

    public function validatedBy(): string
    {
        return NotBlankValidator::class;
    }
}
