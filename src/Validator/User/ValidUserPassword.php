<?php
declare(strict_types=1);

namespace App\Validator\User;

use Symfony\Component\Validator\Constraint;


#[\Attribute(\Attribute::TARGET_PROPERTY | \Attribute::TARGET_METHOD | \Attribute::IS_REPEATABLE)]
class ValidUserPassword extends Constraint {
    public $tooShortMessage = 'validator.user.password.too_short';
    public $tooLongMessage = 'validator.user.password.too_long';
    public $wellKnownPasswordMessage = 'validator.user.password.well_known';
    public $invalidMessage = 'validator.user.password.invalid';

    public const TOO_SHORT_CODE = "c4275cbf-edab-4faf-b528-89f9f23968c7";
    public const TOO_LONG_CODE = "d97ed45b-bcca-4929-9bed-2d6bd5757483";
    public const WELL_KNOWN_CODE = "30d86876-720f-4310-b243-5e26c2156130";
    public const INVALID_CODE = "972e7354-1917-4f1e-a087-5b699a97d4a8";

    public function validatedBy()
    {
        return UserPasswordValidator::class;
    }
}