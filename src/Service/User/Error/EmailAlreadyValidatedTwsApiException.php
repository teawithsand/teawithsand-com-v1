<?php

declare(strict_types=1);

namespace App\Service\User\Error;

use App\Service\Error\TwsApiException;
use Symfony\Component\HttpFoundation\Response;

class EmailAlreadyValidatedTwsApiException extends TwsApiException
{
    protected function initializeException(): void
    {
        $this->info = $this
            ->info
            ->setStatus(Response::HTTP_UNPROCESSABLE_ENTITY)
            ->setUserMessage("exception.unprocessable_entity.email_already_validated");
    }
}
