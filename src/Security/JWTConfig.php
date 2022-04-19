<?php

declare(strict_types=1);

namespace App\Security;

use App\Entity\User\Profile\Profile;
use DateInterval;
use DateTimeImmutable;
use DateTimeZone;
use InvalidArgumentException;
use Lcobucci\Clock\Clock;
use Lcobucci\Clock\SystemClock;
use Lcobucci\JWT\Configuration;
use Lcobucci\JWT\Signer\Hmac\Sha256;
use Lcobucci\JWT\Signer\Key\InMemory;
use Lcobucci\JWT\UnencryptedToken;
use Lcobucci\JWT\Validation\Constraint\LooseValidAt;
use Lcobucci\JWT\Validation\Constraint\SignedWith;
use Lcobucci\JWT\Validation\RequiredConstraintsViolated;
use Symfony\Component\Security\Core\Event\AuthenticationEvent;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Exception\AuthenticationExpiredException;
use Symfony\Component\Uid\Ulid;
use Symfony\Component\Uid\Uuid;


use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Flex\Configurator;

class JWTConfig
{
    private Clock $clock;
    private Configuration $refreshTokenConfig;
    private Configuration $authTokenConfig;
    private Configuration $resetPasswordTokenConfig;

    public function __construct(ParameterBagInterface $bag)
    {
        $this->clock = new SystemClock(new DateTimeZone("UTC"));

        /**
         * @var string
         */
        $refreshSecret = $bag->get("app.refresh_token_secret_key");

        /**
         * @var string
         */
        $authSecret = $bag->get("app.auth_token_secret_key");

        /**
         * @var string
         */
        $resetSecret = $bag->get("app.reset_password_token_secret_key");
        $this->refreshTokenConfig = $this->makeRefreshTokenConfig(
            $refreshSecret,
        );
        $this->authTokenConfig = $this->makeAuthTokenConfig(
            $authSecret
        );
        $this->resetPasswordTokenConfig = $this->makeResetPasswordTokenConfig(
            $resetSecret
        );
    }

    /**
     * Generates unique identifier for token nonce.
     * @deprecated Moved to TokenIssueService
     */
    public function generateTokenNonce(): string
    {
        return Uuid::v4()->toBase58();
    }

    public function getRefreshTokenConfig(): Configuration
    {
        return $this->refreshTokenConfig;
    }

    public function getAuthTokenConfig(): Configuration
    {
        return $this->authTokenConfig;
    }

    public function getResetPasswordTokenConfig(): Configuration
    {
        return $this->resetPasswordTokenConfig;
    }

    private function makeRefreshTokenConfig(
        string $base64EncodedSecret
    ): Configuration {
        $signer = new Sha256();

        $key = InMemory::base64Encoded($base64EncodedSecret);
        $configuration = Configuration::forSymmetricSigner(
            $signer,
            $key,
        );

        $configuration->setValidationConstraints(
            new LooseValidAt($this->clock, DateInterval::createFromDateString("10 seconds")),
            new SignedWith($signer, $key),
        );

        return $configuration;
    }

    private function makeAuthTokenConfig(
        string $base64EncodedSecret
    ): Configuration {
        $signer = new Sha256();

        $key = InMemory::base64Encoded($base64EncodedSecret);
        $configuration = Configuration::forSymmetricSigner(
            $signer,
            $key,
        );
        $configuration->setValidationConstraints(
            new LooseValidAt($this->clock, DateInterval::createFromDateString("10 seconds")),
            new SignedWith($signer, $key),
        );
        return $configuration;
    }

    private function makeResetPasswordTokenConfig(
        string $base64EncodedSecret,
    ): Configuration {
        $signer = new Sha256();

        $key = InMemory::base64Encoded($base64EncodedSecret);
        $configuration = Configuration::forSymmetricSigner(
            $signer,
            $key,
        );
        $configuration->setValidationConstraints(
            new LooseValidAt($this->clock, DateInterval::createFromDateString("10 seconds")),
            new SignedWith($signer, $key),
        );
        return $configuration;
    }

    /**
     * @deprecated Use TokenIssueService instead
     */
    public function issueRefreshTokenForProfile(
        Profile $profile,
    ): string {
        return $this->issueRefreshToken(
            $profile->getId(),
            $profile->getRefreshTokenNonce(),
        );
    }

    /**
     * @deprecated Use TokenIssueService instead
     */
    private function issueRefreshToken(
        Ulid $uid,
        string $nonce,
    ): string {
        $config = $this->getRefreshTokenConfig();

        $now = new DateTimeImmutable();

        return $config
            ->builder()
            ->withClaim("uid", $uid->__toString())
            ->withClaim("nce", $nonce)
            ->issuedAt($now)
            ->expiresAt($now->modify("+365 days"))
            ->getToken($config->signer(), $config->signingKey())
            ->toString();
    }

    /**
     * @deprecated Use TokenIssueService instead
     */
    public function issueAuthTokenForProfile(
        Profile $profile,
    ): string {
        return $this->issueAuthToken(
            $profile->getId(),
            $profile->getRefreshTokenNonce(),
        );
    }

    /**
     * @deprecated Use TokenIssueService instead
     */
    private function issueAuthToken(
        Ulid $uid,
        string $nonce,
    ): string {
        $config = $this->getAuthTokenConfig();

        $now = new DateTimeImmutable();

        return $config
            ->builder()
            ->withClaim("uid", $uid->__toString())
            ->withClaim("nonce", $nonce)
            ->issuedAt($now)
            ->expiresAt($now->modify("+365 days"))
            ->getToken($config->signer(), $config->signingKey())
            ->toString();
    }

    /**
     * @deprecated Use TokenValidationService instead
     */
    public function parseRefreshToken(string $token): array
    {
        $config = $this->getRefreshTokenConfig();
        $parsedToken = null;
        try {
            $parsedToken = $config->parser()->parse($token);

            $constraints = $config->validationConstraints();
            $config->validator()->assert($parsedToken, ...$constraints);
        } catch (InvalidArgumentException $e) {
            throw new AuthenticationException("Invalid JWT provided - invalid format");
        } catch (RequiredConstraintsViolated $e) {
            throw new AuthenticationExpiredException("Invalid JWT provided - invalid contents");
        }
        if (!($parsedToken instanceof UnencryptedToken)) {
            throw new AuthenticationException("Invalid JWT provided - filed to parse");
        }
        $uid = new Ulid($parsedToken->claims()->get("uid"));
        $nonce = $parsedToken->claims()->get("nce");

        return [
            'uid' => $uid,
            'nce' => $nonce ?? "",
        ];
    }

    /**
     * @deprecated Use TokenValidationService instead
     */
    public function parseAuthToken(string $token): array
    {
        $config = $this->getAuthTokenConfig();
        $parsedToken = null;
        try {
            $parsedToken = $config->parser()->parse($token);

            $constraints = $config->validationConstraints();
            $config->validator()->assert($parsedToken, ...$constraints);
        } catch (InvalidArgumentException $e) {
            throw new AuthenticationException("Invalid JWT provided - invalid format");
        } catch (RequiredConstraintsViolated $e) {
            throw new AuthenticationExpiredException("Invalid JWT provided - invalid contents");
        }
        if (!($parsedToken instanceof UnencryptedToken)) {
            throw new AuthenticationException("Invalid JWT provided - filed to parse");
        }

        $uid = new Ulid($parsedToken->claims()->get("uid"));
        $nonce = $parsedToken->claims()->get("nce");

        return [
            'uid' => $uid,
            'nce' => $nonce ?? "",
        ];
    }

    // TODO(teawithsand): figure out what to do with this little util.

    /**
     * @return string[]
     */
    public function getAuthHeaderForToken(string $token): array
    {
        return [AppJWTAuthenticator::HEADER, AppJWTAuthenticator::PREFIX . $token];
    }
}
