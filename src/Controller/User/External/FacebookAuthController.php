<?php

namespace App\Controller\User\External;

use App\Security\JWTConfig;
use App\Service\User\ExternalUserService;
use KnpU\OAuth2ClientBundle\Client\ClientRegistry;
use League\OAuth2\Client\Provider\Exception\IdentityProviderException;
use League\OAuth2\Client\Provider\FacebookUser;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\Routing\Annotation\Route;

class FacebookAuthController extends AbstractController
{
    #[Route('/external/facebook/connect', name: 'app_user_connect_facebook')]
    public function connectFacebook(ClientRegistry $clientRegistry): Response
    {
        return $clientRegistry
            ->getClient('facebook')
            ->redirect([
                'public_profile', 'email',
            ], []);
    }

    #[Route('/external/facebook/check', name: 'app_user_check_facebook')]
    public function checkConnectAction(
        Request $request,
        ClientRegistry $clientRegistry,
        LoggerInterface $logger,
        ExternalUserService $externalUserService,
        JWTConfig $config,
    ) {
        $client =  $clientRegistry->getClient('facebook');

        try {
            $user = $client->fetchUser();
            if (!($user instanceof FacebookUser)) {
                throw new IdentityProviderException("Not a facebook user", 0, "");
            }

            $facebookUser = $externalUserService->registerOrGetFacebookUser($user);
        } catch (IdentityProviderException $e) {
            $logger->info("Filed to login facebook user due to IdentityProviderException: {$e->getMessage()}");
            return new BadRequestHttpException("Facebook login filed. Please try again.");
        }
        $cookie = (new Cookie("reftoken"))
            ->withValue($config->issueRefreshTokenForProfile($facebookUser->getProfile()));
        // use session based expires for such tokens
        // ->withExpires((new \DateTimeImmutable())->modify("+1 hour"));
        //$res = $this->redirectToRoute("app_home");
        $res = $this->render('external/redirect.html.twig');
        $res->headers->setCookie($cookie);

        return $res;
    }
}
