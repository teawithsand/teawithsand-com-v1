<?php

declare(strict_types=1);

namespace App\Security\Token\Exception;

use App\Service\Error\TwsApiException;
use App\Service\Error\TwsApiExceptionInfo;
use Symfony\Component\HttpFoundation\Response;

class TokenTwsApiException extends TwsApiException
{
    protected function initializeException(): void
    {
        // if (!$this->info->isEmpty()) {
        $this->info = (new TwsApiExceptionInfo)
            ->setUserMessage("exception.forbidden.invalid_token")
            ->setStatusCode(Response::HTTP_FORBIDDEN);
        //}
    }
}
