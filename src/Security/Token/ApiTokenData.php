<?php

declare(strict_types=1);

namespace App\Security\Token;

use Symfony\Component\Uid\Ulid;

/**
 * Container for all data in token, which has been given by user or generated by app.
 * For distinction from symfony builtin types it's called ApiTokenData.
 */
final class ApiTokenData
{
    const KIND_REFRESH = "refresh";
    const KIND_AUTH = "auth";
    const KIND_RESET_PASSWORD = "passreset";

    public function __construct(
        private string $kind,
        private Ulid $profileId,
        private string $nonce,
    ) {
    }

    public function getKind(): string
    {
        return $this->kind;
    }

    public function getProfileId(): Ulid
    {
        return $this->profileId;
    }

    public function getNonce(): string
    {
        return $this->nonce;
    }
}
