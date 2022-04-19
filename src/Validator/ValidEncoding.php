<?php
declare(strict_types=1);

namespace App\Validator;

use Symfony\Component\Validator\Constraint;

#[\Attribute(\Attribute::TARGET_PROPERTY | \Attribute::TARGET_METHOD | \Attribute::IS_REPEATABLE)]
class ValidEncoding extends Constraint {
    public $message = 'validator.common.invalid_encoding';
    public const INVALID_ENCODING_CODE = "ea480531-1af4-4ece-9df0-a5ba2a077633";

    public function validatedBy()
    {
        return EncodingValidator::class;
    }
}