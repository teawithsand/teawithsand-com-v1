<?php
declare(strict_types=1);

namespace App\Validator\User;

use Symfony\Component\Validator\Constraint;


#[\Attribute(\Attribute::TARGET_PROPERTY | \Attribute::TARGET_METHOD | \Attribute::IS_REPEATABLE)]
class ValidUserLogin extends Constraint {
    public $tooShortMessage = 'validator.user.login.too_short';
    public $tooLongMessage = 'validator.user.login.too_long';
    public $invalidMessage = 'validator.user.login.invalid';

    public const TOO_SHORT_CODE = "0e8d2f5c-48e5-4ba3-b506-d8788be769fb";
    public const TOO_LONG_CODE = "7da6dbda-18b1-40ca-a0fd-e65fd24e5bb5";
    public const INVALID_CODE = "fafbe30a-d6e3-4bb3-b905-761380a2fa0c";

    public function validatedBy()
    {
        // TODO(teawithsand): implement this validator 
        return UserLoginValidator::class;
    }
}