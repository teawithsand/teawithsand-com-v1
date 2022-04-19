<?php
declare(strict_types=1);

namespace App\Service\Validator;

use Symfony\Component\Validator\Validator\ValidatorInterface;
use ApiPlatform\Core\Bridge\Symfony\Validator\Exception\ValidationException;

// TODO(teawithsand): attach this service to all custom controllers in order to validate incoming data
final class ValidatorService
{
    public function __construct(
        private ValidatorInterface $validator
    ) {
    }

    /**
     * Throws if validation of specified input data fails.
     */
    public function validateThrow(mixed $data)
    {
        $violations = $this->validator->validate($data);
        if (count($violations) > 0) {
            throw new ValidationException($violations);
        }
    }
}
