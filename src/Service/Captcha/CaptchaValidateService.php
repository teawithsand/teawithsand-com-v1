<?php

namespace App\Service\Captcha;

use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

final class CaptchaValidateService
{
    private string $env;
    public function __construct(
        private RecaptchaService $recaptchaService,
        ParameterBagInterface $bag,
    ) {
        /**
         * @psalm-suppress InvalidPropertyAssignmentValue
         */
        $this->env = $bag->get("kernel.environment");
    }

    public function validCaptchaOrThrow(string $token): void
    {
        if ($this->env === "test") {
            if ($token !== "iamnotarobot") {
                throw new CaptchaTwsApiException("Captcha validation filed for testing");
            }
        } else {
            $this->recaptchaService->validateRecaptcha($token);
        }
    }
}
