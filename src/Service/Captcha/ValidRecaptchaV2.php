<?php
declare(strict_types=1);

namespace App\Service\Captcha;

use Symfony\Component\Validator\Constraint;

/**
 * @deprecated use CaptchaValidateService instead.
 */
#[\Attribute(\Attribute::TARGET_PROPERTY | \Attribute::TARGET_METHOD | \Attribute::IS_REPEATABLE)]
class ValidRecaptchaV2 extends Constraint {
    // TODO(teawithsand): use trans key here instead
    public $message = 'You must pass CAPTCHA test';

    public function validatedBy()
    {
        return RecaptchaV2Validator::class;
    }
}