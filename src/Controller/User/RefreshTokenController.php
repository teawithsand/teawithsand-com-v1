<?php

namespace App\Controller\User;

use App\Entity\User\Profile\Profile;
use App\Repository\User\Native\NativeUserRepository;
use App\Security\Token\ApiTokenData;
use App\Security\Token\TokenIssueService;
use App\Security\Token\TokenParseService;
use App\Service\User\Error\BadNonceTokenTwsApiException;
use App\Service\User\Error\InvalidUsernamePasswordTwsApiException;
use App\Service\User\UserLoadService;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[Route("/api/v1/token/refresh", name: "user_refresh_token_")]
class RefreshTokenController extends AbstractFOSRestController
{
    #[Route('/issue', methods: ["POST"], name: 'issue')]
    public function loginNativeUser(
        Request $request,
        TokenIssueService $tokenIssueService,
        NativeUserRepository $nativeUserRepository,
        UserPasswordHasherInterface $hasher,
    ): View {
        $login = $request->request->get('login', '');
        $password = $request->request->get('password', '');

        $user = $nativeUserRepository->findOneBy([
            'login' => $login,
        ]);

        if (!$user) {
            throw new InvalidUsernamePasswordTwsApiException("User not found");
        }

        if (!$hasher->isPasswordValid($user, $password)) {
            throw new InvalidUsernamePasswordTwsApiException("Password given is not valid");
        }

        $this->denyAccessUnlessGranted(Profile::VOTE_ISSUE_REFRESH_TOKEN, $user);

        return View::create([
            'token' => $tokenIssueService->issueSignedApiToken($user->getUserProfile()->getApiTokenData(ApiTokenData::KIND_REFRESH)),
        ], Response::HTTP_OK);
    }

    #[Route('/exchange', methods: ["POST"], name: 'exchange')]
    public function exchangeRefreshToken(Request $request, TokenParseService $tokenParseService, TokenIssueService $tokenIssueService, UserLoadService $svc): View
    {
        $token = $request->request->get('token', '');

        $refreshToken = $tokenParseService->parseTokenFromString($token, ApiTokenData::KIND_REFRESH);
        $user = $svc->loadUserByProfileId($refreshToken->getProfileId());
        if (!$user) {
            throw new NotFoundHttpException("No such profile exists");
        }


        if (!hash_equals($user->getUserProfile()->getRefreshTokenNonce(), $refreshToken->getNonce())) {
            throw new BadNonceTokenTwsApiException("Invalid token nonce");
        }

        $this->denyAccessUnlessGranted(Profile::VOTE_ISSUE_AUTH_TOKEN, $user);

        return View::create([
            'token' => $tokenIssueService->issueSignedApiToken($user->getUserProfile()->getApiTokenData(ApiTokenData::KIND_AUTH)),
        ], Response::HTTP_OK);
    }

    // TODO(teawtishand): put it behind refresh-token authenticated rotue
    public function invalidateAllSessions()
    {
        throw new NotFoundHttpException("NIY");
    }

    #[Route('/refresh', methods: ["POST"], name: 'refresh')]
    public function introspectRefreshToken(Request $request): View
    {
        // refresh refresh token
        // in order to make session live longer
        // for now NIY
        throw new NotFoundHttpException();
    }
}
