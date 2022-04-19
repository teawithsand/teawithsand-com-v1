<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Log\DebugLoggerInterface;
use Symfony\Component\Routing\Annotation\Route;
use Throwable;

class ErrorController extends AbstractController
{
    public function show(Throwable $exception, ?DebugLoggerInterface $logger): Response
    {
        // in order to trigger debug handler
        // throw $exception;
        return new Response('Error controller hell world!');
    }
}
