<?php
declare(strict_types=1);

namespace App\Validator\User;

use Symfony\Component\Validator\Constraint;


#[\Attribute(\Attribute::TARGET_PROPERTY | \Attribute::TARGET_METHOD | \Attribute::IS_REPEATABLE)]
class ValidEmail extends Constraint {
    public $invalidMessage = 'validator.user.email.invalid';

    public const INVALID_CODE = "9cd3f897-e711-430c-8715-71537b9cb43f";

    public function validatedBy()
    {
        return EmailValidator::class;
    }
}