<?php

declare(strict_types=1);

namespace App\Service\Error;

use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

class TwsApiException extends \RuntimeException implements HttpExceptionInterface
{
    protected TwsApiExceptionInfo $info;

    protected function initializeException(): void
    {
    }

    public function __construct(string $message = '', ?\Throwable $previous = null, ?TwsApiExceptionInfo $info = null)
    {
        $this->info = $info ?? new TwsApiExceptionInfo;

        parent::__construct($message, 0, $previous);

        $this->initializeException();
    }

    public function getInfo(): TwsApiExceptionInfo
    {
        return $this->info;
    }

    public function getStatusCode(): int
    {
        return $this->info->getStatus();
    }

    public function getHeaders(): array
    {
        return $this->info->getHeaders();
    }
}
