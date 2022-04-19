<?php

declare(strict_types=1);

namespace App\Security\Token;

use App\Security\JWTConfig;
use App\Security\Token\Exception\IssueTokenTwsApiException;
use DateTimeImmutable;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Uid\Uuid;

/**
 * Service responsible for validation of incoming tokens.
 */
class TokenIssueService
{
    /**
     * Note: this prefix includes all white chars required.
     */
    public const TOKEN_HEADER_PREFIX = "Bearer ";
    public const TOKEN_HEADER_NAME = "Authorization";

    public function __construct(
        private JWTConfig $jwtConfig,
    ) {
    }

    public function isRequestAuthenticated(Request $request): bool
    {
        return $request->headers->has(self::TOKEN_HEADER_NAME) && str_starts_with(
            $request->headers->get(self::TOKEN_HEADER_NAME, ""),
            self::TOKEN_HEADER_PREFIX,
        );
    }

    public function generateTokenNonce(): string
    {
        return Uuid::v4()->toBase58();
    }

    public function issueSignedApiToken(
        ApiTokenData $data,
    ): string {
        if (!$data->getNonce())
            throw new IssueTokenTwsApiException("Can't issue token with empty nonce; generate some with generateTokenNonce");
        $now = new DateTimeImmutable();

        $kind = $data->getKind();
        if ($kind === ApiTokenData::KIND_AUTH) {
            $config = $this->jwtConfig->getAuthTokenConfig();
            $expires = $now->modify("+15 minutes");
        } else if ($kind === ApiTokenData::KIND_REFRESH) {
            $config = $this->jwtConfig->getRefreshTokenConfig();
            $expires = $now->modify("+365 days");
        } else if ($kind === ApiTokenData::KIND_RESET_PASSWORD) {
            $config = $this->jwtConfig->getResetPasswordTokenConfig();
            $expires = $now->modify("+1 days");
        } else {
            throw new IssueTokenTwsApiException("Invalid token kind: $kind");
        }


        $now = new DateTimeImmutable();

        return $config
            ->builder()
            ->withClaim("uid", $data->getProfileId()->__toString())
            ->withClaim("nce", $data->getNonce())
            ->issuedAt($now)
            ->expiresAt($expires)
            ->getToken($config->signer(), $config->signingKey())
            ->toString();
    }
}
