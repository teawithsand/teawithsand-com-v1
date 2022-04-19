<?php

namespace App\EventSubscriber\Error;

use App\Service\Captcha\RecaptchaService;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Twig\Environment;

class NotFoundSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private Environment $environment,
        private RecaptchaService $recaptchaService,
    ) {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            'kernel.exception' => ['onKernelException', 2],
        ];
    }

    public function onKernelException(ExceptionEvent $event): void
    {
        if ('html' !== $event->getRequest()->getRequestFormat('')) {
            return;
        }

        $throwable = $event->getThrowable();
        if (!($throwable instanceof HttpExceptionInterface)) {
            return;
        }

        if ($throwable->getStatusCode() !== 404) {
            return;
        }

        $content = $this->environment->render("home/index.html.twig", [
            "recaptchaPublicToken" => $this->recaptchaService->getPublicToken(),
            "notFound" => true,
        ]);

        $response = new Response();
        $response->setContent($content);
        $response->setStatusCode(Response::HTTP_OK);

        $event->setResponse($response);
    }
}
