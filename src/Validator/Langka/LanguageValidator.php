<?php

declare(strict_types=1);

namespace App\Validator\Langka;

use App\Validator\CommonValidatorService;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;
use Symfony\Component\Validator\Exception\UnexpectedValueException;

class LanguageValidator extends ConstraintValidator
{
    public function __construct(
        private CommonValidatorService $commonValidatorService,
    ) {
    }

    public function validate($value, Constraint $constraint)
    {
        if (!($constraint instanceof ValidLanguage)) {
            throw new UnexpectedTypeException($constraint, ValidLanguage::class);
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

        if (!$this->commonValidatorService->isValidTitle($value) || preg_match("/^[a-z]{2}$/", $value) !== 1) {
            $this->context
                ->buildViolation($constraint->invalidMessage)
                ->setCode(ValidLanguage::INVALID_CODE)
                ->addViolation();
        }
    }
}
