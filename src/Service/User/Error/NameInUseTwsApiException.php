<?php

declare(strict_types=1);

namespace App\Service\User\Error;

use App\Service\Error\TwsApiException;
use Symfony\Component\HttpFoundation\Response;

class NameInUseTwsApiException extends TwsApiException
{
    protected function initializeException(): void
    {
        $this->info = $this
            ->info
            ->setStatus(Response::HTTP_FORBIDDEN)
            ->setUserMessage("exception.unprocessable_entity.user.username_in_use");
    }
}
