<?php

declare(strict_types=1);

namespace App\Validator\Langka;

use App\Validator\CommonValidatorService;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;
use Symfony\Component\Validator\Exception\UnexpectedValueException;

class WordSetDescriptionValidator extends ConstraintValidator
{
    public function __construct(
        private CommonValidatorService $commonValidatorService,
    ) {
    }

    public function validate($value, Constraint $constraint)
    {
        if (!($constraint instanceof ValidWordSetDescription)) {
            throw new UnexpectedTypeException($constraint, ValidWordSetDescription::class);
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

        if ($this->commonValidatorService->strlen($value) > 1024 * 16) {
            $this->context
                ->buildViolation($constraint->tooLongMessage)
                ->setCode(ValidWordSetDescription::TOO_LONG_CODE)
                ->addViolation();
        }

        if (!$this->commonValidatorService->isValidDescription($value)) {
            $this->context
                ->buildViolation($constraint->invalidMessage)
                ->setCode(ValidWordSetDescription::INVALID_CODE)
                ->addViolation();
        }
    }
}
