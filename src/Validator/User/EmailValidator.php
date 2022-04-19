<?php

declare(strict_types=1);

namespace App\Validator\User;

use App\Validator\CommonValidatorService;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;
use Symfony\Component\Validator\Exception\UnexpectedValueException;
use Egulias\EmailValidator\EmailValidator as EguliasEmailValidator;
use Egulias\EmailValidator\Validation\NoRFCWarningsValidation;

class EmailValidator extends ConstraintValidator
{
    private const PATTERN_HTML5 = '/^[a-zA-Z0-9.!#$%&\'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/';
    private const PATTERN_LOOSE = '/^.+\@\S+\.\S+$/';

    public function __construct(
        private CommonValidatorService $service,
    ) {
    }

    public function validate($value, Constraint $constraint)
    {
        if (!($constraint instanceof ValidEmail)) {
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

        $strictValidator = new EguliasEmailValidator();

        if (
            !$strictValidator->isValid($value, new NoRFCWarningsValidation()) &&
            preg_match(self::PATTERN_HTML5, $value) !== 1
        ) {
            $this->context->buildViolation($constraint->message)
                ->setParameter('{{ value }}', $this->formatValue($value))
                ->setCode(ValidEmail::INVALID_CODE)
                ->addViolation();
        }
    }
}
