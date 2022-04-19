<?php

declare(strict_types=1);

namespace App\Security;

use App\Entity\User\AppUser;
use App\Security\Token\ApiTokenData;
use App\Security\Token\Exception\ValidateTokenTwsApiException;
use App\Security\Token\TokenParseService;
use App\Service\User\UserLoadService;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Credentials\CustomCredentials;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Uid\Ulid;

class AppJWTAuthenticator extends AbstractAuthenticator
{
    public const PREFIX = "Bearer ";
    public const HEADER = "Authorization";

    public function __construct(
        private TokenParseService $tokenParseService,
        private UserLoadService $userLoadService,
        private SerializerInterface $serializerInterface,
    ) {
    }


    public function supports(Request $request): bool
    {
        return $request->headers->has(self::HEADER) && str_starts_with(
            $request->headers->get(self::HEADER, ""),
            self::PREFIX,
        );
    }

    public function authenticate(Request $request): Passport
    {
        $token = $this->tokenParseService->parseTokenFromRequest($request, ApiTokenData::KIND_REFRESH);

        $svc = $this->userLoadService;

        $userBadge = new UserBadge($token->getProfileId()->__toString(), function ($id) use ($svc) {
            if (is_string($id)) {
                $id = new Ulid($id);
            }
            return $svc->loadUserByProfileId($id);
        });

        $credentials = new CustomCredentials(function (string $credentials, ?AppUser $user) use ($svc) {
            if (!$user)
                return false;

            return true;
            //return hash_equals($user->getUserProfile()->getRefreshTokenNonce(), $credentials);
        }, $token->getNonce());

        $passport = new Passport(
            $userBadge,
            $credentials,
        );

        // $passport->setAttribute('nce', $token->getNonce());

        return $passport;
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {
        // Let request continue
        return null;
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): ?Response
    {
        $data = $this->serializerInterface->serialize(
            new ValidateTokenTwsApiException("Filed to validate incoming token"), 
            'json'
        );

        $r = new Response($data, Response::HTTP_FORBIDDEN, [
            "Content-Type" => "application/json"
        ]);

        return $r;
    }

    //    public function start(Request $request, AuthenticationException $authException = null): Response
    //    {
    //        /*
    //         * If you would like this class to control what happens when an anonymous user accesses a
    //         * protected page (e.g. redirect to /login), uncomment this method and make this class
    //         * implement Symfony\Component\Security\Http\EntryPoint\AuthenticationEntryPointInterface.
    //         *
    //         * For more details, see https://symfony.com/doc/current/security/experimental_authenticators.html#configuring-the-authentication-entry-point
    //         */
    //    }
}
