<?php

declare(strict_types=1);

namespace App\Validator;

use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;
use Symfony\Component\Validator\Exception\UnexpectedValueException;

class EncodingValidator extends ConstraintValidator
{
    public function __construct(
        private CommonValidatorService $commonValidatorService,
    ) {
    }

    public function validate($value, Constraint $constraint)
    {
        if (!$constraint instanceof ValidEncoding) {
            throw new UnexpectedTypeException($constraint, ValidEncoding::class);
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

        if (!$this->commonValidatorService->isValidUtf8($value)) {
            $this->context
                ->buildViolation($constraint->message)
                ->setCode(ValidEncoding::INVALID_ENCODING_CODE)
                ->addViolation();
        }
    }
}
