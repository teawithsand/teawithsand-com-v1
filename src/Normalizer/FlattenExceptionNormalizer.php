<?php

declare(strict_types=1);

namespace App\Normalizer;

use ApiPlatform\Core\Exception\InvalidArgumentException;
use Symfony\Component\ErrorHandler\Exception\FlattenException;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\Normalizer\ContextAwareNormalizerInterface;

class FlattenExceptionNormalizer implements ContextAwareNormalizerInterface
{

    /**
     * @param FlattenException $object 
     */
    public function normalize(mixed $object, string $format = null, array $context = [])
    {
        $status = $object->getStatusCode();
        if($object->getClass() === InvalidArgumentException::class){
            $status = Response::HTTP_BAD_REQUEST;
        }
        $message = Response::$statusTexts[$status] ?? 'Unknown error';

        return [
            'code' => $status,
            'status' => $status,
            'title' => $message,
        ];
    }

    public function supportsNormalization(mixed $data, string $format = null, array $context = []): bool
    {
        if (!($data instanceof FlattenException)) {
            return false;
        }

        // we are in messenger context
        if (!empty($context['messenger_serialization'])) { // Serializer::MESSENGER_SERIALIZATION_CONTEXT
            return false;
        }

        return true;
    }
}

/*
private $statusCodeMap;
    private $messagesMap;
    private $debug;
    private $rfc7807;

    public function __construct(ExceptionValueMap $statusCodeMap, ExceptionValueMap $messagesMap, bool $debug, bool $rfc7807)
    {
        $this->statusCodeMap = $statusCodeMap;
        $this->messagesMap = $messagesMap;
        $this->debug = $debug;
        $this->rfc7807 = $rfc7807;
    }

    public function normalize($exception, $format = null, array $context = []): array
    {
        if (isset($context['status_code'])) {
            $statusCode = $context['status_code'];
        } elseif (null === $statusCode = $this->statusCodeMap->resolveFromClassName($exception->getClass())) {
            $statusCode = $exception->getStatusCode();
        }

        $showMessage = $this->messagesMap->resolveFromClassName($exception->getClass());

        if ($showMessage || $this->debug) {
            $message = $exception->getMessage();
        } else {
            $message = Response::$statusTexts[$statusCode] ?? 'error';
        }

        if ($this->rfc7807) {
            if ('json' === $format) {
                $exception->setHeaders($exception->getHeaders() + ['Content-Type' => 'application/problem+json']);
            } elseif ('xml' === $format) {
                $exception->setHeaders($exception->getHeaders() + ['Content-Type' => 'application/problem+xml']);
            }

            return [
                'type' => $context['type'] ?? 'https://tools.ietf.org/html/rfc2616#section-10',
                'title' => $context['title'] ?? 'An error occurred',
                'status' => $statusCode,
                'detail' => $message,
            ];
        } else {
            return [
                'code' => $statusCode,
                'message' => $message,
            ];
        }
    }

    public function supportsNormalization($data, $format = null, array $context = []): bool
    {
        if (!($data instanceof FlattenException)) {
            return false;
        }

        // we are in fos rest context
        if (!empty($context[Serializer::FOS_BUNDLE_SERIALIZATION_CONTEXT])) {
            return true;
        }

        // we are in messenger context
        if (!empty($context['messenger_serialization'])) { // Serializer::MESSENGER_SERIALIZATION_CONTEXT
            return false;
        }

        return true;
    }
*/