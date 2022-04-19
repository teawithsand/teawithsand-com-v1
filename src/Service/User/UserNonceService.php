<?php

namespace App\Service\User;

use Symfony\Component\Uid\Uuid;

class UserNonceService
{
    public function generateEmailConfirmNonce(): string
    {
        return bin2hex(random_bytes(32));
    }

    public function generateRefreshTokenNonce(): string
    {
        return UUid::v4();
    }

    public function generateAuthTokenNonce(): string
    {
        return UUid::v4();
    }
}
