<?php

declare(strict_types=1);

namespace App\Service\Captcha;

use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;
use Symfony\Component\Validator\Exception\UnexpectedValueException;

/**
 * @deprecated use CaptchaValidateService instead.
 */
class RecaptchaV2Validator extends ConstraintValidator
{
    public function __construct(
        private RecaptchaService $recaptchaService,
    ) {
    }
    public function validate($value, Constraint $constraint)
    {
        // make this validator not work again(?)
        return;
        if (!$constraint instanceof ValidRecaptchaV2) {
            throw new UnexpectedTypeException($constraint, ContainsAlphanumeric::class);
        }

        // custom constraints should ignore null and empty values to allow
        // other constraints (NotBlank, NotNull, etc.) to take care of that
        if (null === $value || '' === $value) {
            return;
        }

        if (!is_string($value)) {
            // throw this exception if your validator cannot handle the passed type so that it can be marked as invalid
            throw new UnexpectedValueException($value, 'string');

            // separate multiple types using pipes
            // throw new UnexpectedValueException($value, 'string|int');
        }

        try {
            $this->recaptchaService->validateRecaptcha($value);
        } catch (CaptchaTwsApiException $e) {
            $this->context->buildViolation($constraint->message)
                ->addViolation();
        }
    }
}
