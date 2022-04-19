<?php

declare(strict_types=1);

namespace App\Validator\Langka;

use App\Validator\CommonValidatorService;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;
use Symfony\Component\Validator\Exception\UnexpectedValueException;

class WordSetTitleValidator extends ConstraintValidator
{
    public function __construct(
        private CommonValidatorService $commonValidatorService,
    ) {
    }

    public function validate($value, Constraint $constraint)
    {
        if (!($constraint instanceof ValidWordSetTitle)) {
            throw new UnexpectedTypeException($constraint, ValidWordSetTitle::class);
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

        if ($this->commonValidatorService->strlen($value) < 3) {
            $this->context
                ->buildViolation($constraint->tooShortMessage)
                ->setCode(ValidWordSetTitle::TOO_SHORT_CODE)
                ->addViolation();
        }

        if ($this->commonValidatorService->strlen($value) > 128) {
            $this->context
                ->buildViolation($constraint->tooLongMessage)
                ->setCode(ValidWordSetTitle::TOO_LONG_CODE)
                ->addViolation();
        }

        if (!$this->commonValidatorService->isValidTitle($value)) {
            $this->context
                ->buildViolation($constraint->invalidMessage)
                ->setCode(ValidWordSetTitle::INVALID_CODE)
                ->addViolation();
        }
    }
}
