<?php

declare(strict_types=1);

namespace App\Validator\User;

use App\Validator\CommonValidatorService;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;
use Symfony\Component\Validator\Exception\UnexpectedValueException;

class UserLoginValidator extends ConstraintValidator
{
    public function __construct(
        private CommonValidatorService $service,
    ) {
    }
    public function validate($value, Constraint $constraint)
    {
        if (!($constraint instanceof ValidUserLogin)) {
            throw new UnexpectedTypeException($constraint, ValidUserLogin::class);
        }

        // custom constraints should ignore null and empty values to allow
        // other constraints (NotBlank, NotNull, etc.) to take care of that
        if (null === $value || '' === $value) {
            return;
        }

        if (!is_string($value)) {
            // throw this exception if your validator cannot handle the passed type so that it can be marked as invalid
            throw new UnexpectedValueException($value, 'string');
        }

        if (strlen($value) < 3) {
            $this->context
                ->buildViolation($constraint->tooShortMessage)
                ->setCode(ValidUserLogin::TOO_SHORT_CODE)
                ->addViolation();
        }

        if (strlen($value) > 64) {
            $this->context
                ->buildViolation($constraint->tooLongMessage)
                ->setCode(ValidUserLogin::TOO_LONG_CODE)
                ->addViolation();
        }

        if (!$this->service->isValidTitle($value) || preg_match("/^[a-zA-Z0-9-_]*$/", $value) !== 1) {
            $this->context
                ->buildViolation($constraint->invalidMessage)
                ->setCode(ValidUserLogin::INVALID_CODE)
                ->addViolation();
        }
    }
}
