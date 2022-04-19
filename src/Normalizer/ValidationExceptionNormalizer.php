<?php

declare(strict_types=1);

namespace App\Normalizer;

use ApiPlatform\Core\Bridge\Symfony\Validator\Exception\ValidationException;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\Normalizer\ContextAwareNormalizerInterface;

class ValidationExceptionNormalizer implements ContextAwareNormalizerInterface
{
    public function normalize(mixed $object, string $format = null, array $context = [])
    {
        $status = Response::HTTP_UNPROCESSABLE_ENTITY;

        $title = Response::$statusTexts[$status] ?? 'Unknown error';

        $violations = [];

        $rawViolations = $object->getConstraintViolationList();
        /**
         * @var $violation ConstraintViolationInterface
         */
        foreach ($rawViolations as $violation) {
            $violations[] = [
                "message" => $violation->getMessage(),
                "propertyPath" => $violation->getPropertyPath(),
                "code" => $violation->getCode(),
            ];
        }

        return [
            "title" => $title,
            "violations" => $violations,

            "code" => $status,
            "status" => $status,
        ];
    }

    public function supportsNormalization(mixed $data, string $format = null, array $context = []): bool
    {
        if (!($data instanceof ValidationException)) {
            return false;
        }

        // we are in messenger context
        if (!empty($context['messenger_serialization'])) { // Serializer::MESSENGER_SERIALIZATION_CONTEXT
            return false;
        }

        return true;
    }
}
