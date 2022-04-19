<?php

declare(strict_types=1);

namespace App\Validator\User;

use App\Validator\CommonValidatorService;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;
use Symfony\Component\Validator\Exception\UnexpectedValueException;

class UserPasswordValidator extends ConstraintValidator
{
    public function __construct(
        private CommonValidatorService $service,
    ) {
    }
    public function validate($value, Constraint $constraint)
    {
        if (!$constraint instanceof ValidUserPassword) {
            throw new UnexpectedTypeException($constraint, ValidUserPassword::class);
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

        if (strlen($value) < 8) {
            $this->context
                ->buildViolation($constraint->tooShortMessage)
                ->setCode(ValidUserPassword::TOO_SHORT_CODE)
                ->addViolation();
        }

        if (strlen($value) > 64) {
            $this->context
            ->buildViolation($constraint->tooLongMessage)
                ->setCode(ValidUserPassword::TOO_LONG_CODE)
                ->addViolation();
        }

        // allow any valid utf-8 and it will be ok
        if (!$this->service->isValidUtf8($value)) {
            $this->context
            ->buildViolation($constraint->invalidMessage)
                ->setCode(ValidUserPassword::INVALID_CODE)
                ->addViolation();
        }

        // TODO(teawithsand): add optional leaked check via HIBP with k-anonymity on k = 5
    }
}
