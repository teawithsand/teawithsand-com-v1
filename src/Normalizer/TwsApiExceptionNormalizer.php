<?php

declare(strict_types=1);

namespace App\Normalizer;

use App\Service\Error\TwsApiException;
use Symfony\Component\ErrorHandler\Exception\FlattenException;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

// TODO(teawithsand): get rid of this class
class TwsApiExceptionNormalizer implements NormalizerInterface
{
    public function normalize(mixed $object, string $format = null, array $context = [])
    {
        $title = Response::$statusTexts[$object->getStatusCode()] ?? 'Unknown error';

        return [
            "title" => $title,
            "description" => $object->getInfo()->getUserMessage(),
            "descriptionParams" => $object->getInfo()->getUserMessageParams(),
            "status" => $object->getInfo()->getStatusCode(),
            "code" => $object->getInfo()->getStatusCode(),
        ];

        /*
        if ($object instanceof TwsApiException) {
            if (false && $format === "ld+json") {
                return [
                    "hydra:title" => "An error occurred",
                    "hydra:description" => $object->getInfo()->getUserMessage(),

                    "title" => "An error occurred",
                    "description" => $object->getInfo()->getUserMessage(),
                    "descriptionParams" => $object->getInfo()->getUserMessageParams(),
                ];
            } else {
                
            }
        }
        */
    }

    public function supportsNormalization(mixed $data, string $format = null)
    {
        return $data instanceof TwsApiException;
    }
}
