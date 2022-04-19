<?php

declare(strict_types=1);

namespace App\Service\User\Error;

use App\Service\Error\TwsApiException;
use Symfony\Component\HttpFoundation\Response;

class NoSuchRegistrationForResendTwsApiException extends TwsApiException
{
    protected function initializeException(): void
    {
        $this->info = $this
            ->info
            ->setStatus(Response::HTTP_NOT_FOUND)
            ->setUserMessage("exception.not_found.user.no_registration_for_data");
    }
}
