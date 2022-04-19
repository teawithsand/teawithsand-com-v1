<?php

declare(strict_types=1);

namespace App\Service\User\Error;

use Symfony\Component\HttpFoundation\Response;

class BadNonceTokenTwsApiException extends TokenTwsApiException
{
    protected function initializeException(): void
    {
        $this->info = $this
            ->info
            ->setStatus(Response::HTTP_FORBIDDEN)
            ->setUserMessage("exception.forbidden.invalid_token");
    }
}
