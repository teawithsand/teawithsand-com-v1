<?php

declare(strict_types=1);

namespace App\Service\Error;

use Symfony\Component\HttpFoundation\Response;

class TwsApiExceptionInfo
{
    const VAR_NAME = "twsExceptionInfo";

    private int $status = Response::HTTP_INTERNAL_SERVER_ERROR;
    private array $headers = [];

    private string $userMessage = "";
    private array $userMessageParams = [];

    public function __construct()
    {
    }
    // TODO(teawithsand): deprecate methods without *code (get/set status ones)

    /**
     * Get the value of status
     */
    public function getStatus()
    {
        return $this->status;
    }

    /**
     * Set the value of status
     *
     * @return self
     */
    public function setStatusCode($status)
    {
        $this->status = $status;

        return $this;
    }

    /**
     * Get the value of status
     */
    public function getStatusCode()
    {
        return $this->status;
    }

    /**
     * Set the value of status
     *
     * @return  self
     */
    public function setStatus($status)
    {
        $this->status = $status;

        return $this;
    }

    /**
     * Get the value of headers
     */
    public function getHeaders()
    {
        return $this->headers;
    }

    /**
     * Set the value of headers
     *
     * @return  self
     */
    public function setHeaders($headers)
    {
        $this->headers = $headers;

        return $this;
    }

    /**
     * Get the value of userMessage
     */
    public function getUserMessage()
    {
        return $this->userMessage;
    }

    /**
     * Set the value of userMessage
     *
     * @return  self
     */
    public function setUserMessage($userMessage)
    {
        $this->userMessage = $userMessage;

        return $this;
    }

    /**
     * Get the value of userMessageParams
     */
    public function getUserMessageParams()
    {
        return $this->userMessageParams;
    }

    /**
     * Set the value of userMessageParams
     *
     * @return  self
     */
    public function setUserMessageParams($userMessageParams)
    {
        $this->userMessageParams = $userMessageParams;

        return $this;
    }

    public function isEmpty(): bool
    {
        return $this->userMessage === "" && count($this->userMessageParams) === 0;
    }
}
