<?php

declare(strict_types=1);

namespace App\Service\Error;

use Symfony\Component\HttpFoundation\Response;

class NoValueTwsApiException extends TwsApiException
{
    protected function initializeException(): void
    {
        $this->info = $this
            ->info
            ->setStatus(Response::HTTP_UNPROCESSABLE_ENTITY)
            ->setUserMessage("exception.unprocessable_entity.validation_filed");
    }
}
