<?php

declare(strict_types=1);

namespace App\Security\Token;

use App\Security\JWTConfig;
use App\Security\Token\Exception\InvalidFormatParseTokenTwsApiException;
use App\Security\Token\Exception\TokenTwsApiException;
use App\Security\Token\Exception\ValidateTokenTwsApiException;
use InvalidArgumentException;
use Lcobucci\JWT\UnencryptedToken;
use Lcobucci\JWT\Validation\RequiredConstraintsViolated;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Uid\Ulid;

/**
 * Service responsible for validation of incoming tokens.
 */
class TokenParseService
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

    public function parseTokenFromString(string $token, string $kind): ApiTokenData
    {
        $authConfig = $this->jwtConfig->getAuthTokenConfig();
        $refreshConfig = $this->jwtConfig->getRefreshTokenConfig();
        $resetPasswordConfig = $this->jwtConfig->getResetPasswordTokenConfig();

        try {
            $jwtToken = $authConfig->parser()->parse($token);
        } catch (InvalidArgumentException $e) {
            throw new InvalidFormatParseTokenTwsApiException("Filed to ParseJWT token", $e);
        }

        if (!($jwtToken instanceof UnencryptedToken)) {
            throw new InvalidFormatParseTokenTwsApiException("Parsed jwt token is not unencrypted one");
        }

        if ($kind === ApiTokenData::KIND_AUTH) {
            try {
                $constraints = $authConfig->validationConstraints();
                $authConfig->validator()->assert($jwtToken, ...$constraints);
            } catch (RequiredConstraintsViolated $e) {
                // TODO(teawithsand): use some hacks to implement these violation kinds 
                //  for now it's impossible without hacky regexp message matching
                /*
                    $violations = $e->violations();
                    
                    foreach ($violations as $violation) {
                        if (preg_match('/ sign/', $violation->getMessage()) === 1) {
                            throw new InvalidSignValidateTokenTwsApiException("Sign of token given is not valid", $violation);
                        }
                    }

                    */
                throw new ValidateTokenTwsApiException("Token validation filed", $e);
            }
        } else if ($kind === ApiTokenData::KIND_REFRESH) {
            try {
                $constraints = $refreshConfig->validationConstraints();
                $refreshConfig->validator()->assert($jwtToken,  ...$constraints);
            } catch (RequiredConstraintsViolated $e) {
                // TODO(teawithsand): use some hacks to implement these violation kinds 
                //  for now it's impossible without hacky regexp message matching

                throw new ValidateTokenTwsApiException("Token validation filed", $e);
            }
        } else if($kind === ApiTokenData::KIND_RESET_PASSWORD){
            try {
                $constraints = $resetPasswordConfig->validationConstraints();
                $resetPasswordConfig->validator()->assert($jwtToken,  ...$constraints);
            } catch (RequiredConstraintsViolated $e) {
                // TODO(teawithsand): use some hacks to implement these violation kinds 
                //  for now it's impossible without hacky regexp message matching

                throw new ValidateTokenTwsApiException("Token validation filed", $e);
            }
        } else {
            throw new TokenTwsApiException("Invalid token kind: $kind");
        }

        $uid = new Ulid($jwtToken->claims()->get("uid"));
        $nonce = $jwtToken->claims()->get("nce") ?? "";

        return new ApiTokenData(
            kind: $kind,
            profileId: $uid,
            nonce: $nonce,
        );
    }

    public function parseTokenFromRequest(Request $request, string $kind): ApiTokenData
    {
        $token = substr(
            $request->headers->get(self::TOKEN_HEADER_NAME, ""),
            strlen(self::TOKEN_HEADER_PREFIX),
        );

        return $this->parseTokenFromString($token, $kind);
    }
}
