<?php

declare(strict_types=1);

namespace App\Service\User\Error;

use App\Service\Error\TwsApiException;
use Symfony\Component\HttpFoundation\Response;

class InvalidUsernamePasswordTwsApiException extends TwsApiException
{
    protected function initializeException(): void
    {
        $this->info = $this
            ->info
            ->setStatus(Response::HTTP_NOT_FOUND)
            ->setUserMessage("exception.not_found.user.user_for_login_and_password_not_found");
    }
}
