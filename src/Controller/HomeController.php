<?php

namespace App\Controller;

use App\Repository\User\Profile\ProfileRepository;
use App\Service\User\Error\InvalidUsernamePasswordTwsApiException;
use App\Service\Captcha\RecaptchaService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class HomeController extends AbstractController
{

    #[Route('/profile/change-email/finalize',  name: 'app_user_change_email_finalize')]
    #[Route('/profile/change-email')]
    #[Route('/profile/change-email/resend')]

    #[Route('/profile/reset-password/finalize',  name: 'app_user_reset_password_finalize')]
    #[Route('/profile/reset-password/init')]

    #[Route('/profile/confirm-register',  name: 'app_user_confirm_registration')]
    #[Route('/profile/after-register')]
    #[Route('/profile/register')]
    #[Route('/profile/register-resend-email')]

    #[Route('/profile/login')]
    #[Route('/profile/change-password')]
    #[Route('/profile/view/{id}')]
    #[Route('/profile/view/{id}/details')]

    #[Route('/langka/word-set/show/{id}')]
    #[Route('/langka/word-set/show/{id}/details')]
    #[Route('/langka/word-set/create')]
    #[Route('/langka/word-set/list/public')]
    #[Route('/langka/word-set/list/owned')]

    #[Route('/portfolio')]
    #[Route('/about-me')]
    #[Route('/', name: 'app_home')]
    public function index(
        RecaptchaService $recaptchaService,
    ): Response {
        // TODO(teawithsand): method filtering there
        return $this->render('home/index.html.twig', [
            'recaptchaPublicToken' => $recaptchaService->getPublicToken(),
        ]);
    }
}
