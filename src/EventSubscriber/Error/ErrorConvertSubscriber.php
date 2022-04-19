<?php

namespace App\EventSubscriber\Error;

use ApiPlatform\Core\Bridge\Symfony\Validator\Exception\ValidationException;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use App\Service\Error\TwsApiException;
use ApiPlatform\Core\Util\ErrorFormatGuesser;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\SerializerInterface;

class ErrorConvertSubscriber implements EventSubscriberInterface
{
    private array $errorFormats;
    public function __construct(
        private SerializerInterface $serializer,
    ) {
        $this->errorFormats = [
            'json' => ["application/json"],
        ];
    }

    public static function getSubscribedEvents(): array
    {
        return [
            'kernel.exception' => ['onKernelException', 1],
        ];
    }

    public function onKernelException(ExceptionEvent $event)
    {
        // useful for test debugging, so it's left here
        // dump($event->getThrowable());

        if ('html' === $event->getRequest()->getRequestFormat('')) {
            return;
        }

        $exception = $event->getThrowable();
        if ($exception instanceof TwsApiException) {
            $format = ErrorFormatGuesser::guessErrorFormat($event->getRequest(), $this->errorFormats);

            $event->setResponse(new Response(
                $this->serializer->serialize($exception, $format['key']),
                $exception->getStatusCode(),
                [
                    'Content-Type' => sprintf('%s; charset=utf-8', $format['value'][0]),
                    'X-Content-Type-Options' => 'nosniff',
                    'X-Frame-Options' => 'deny',
                ]
            ));
        } else if ($exception instanceof ValidationException) {
            $format = ErrorFormatGuesser::guessErrorFormat($event->getRequest(), $this->errorFormats);

            $event->setResponse(new Response(
                $this->serializer->serialize($exception, $format['key']),
                Response::HTTP_UNPROCESSABLE_ENTITY,
                [
                    'Content-Type' => sprintf('%s; charset=utf-8', $format['value'][0]),
                    'X-Content-Type-Options' => 'nosniff',
                    'X-Frame-Options' => 'deny',
                ]
            ));
        }
    }
}
