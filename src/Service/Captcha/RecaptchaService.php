<?php

declare(strict_types=1);

namespace App\Service\Captcha;

use App\Service\Captcha\CaptchaTwsApiException;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpClient\Exception\ClientException;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class RecaptchaService
{
    // private string $secret = "6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe";
    // private string $public = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";

    private string $secret;
    private string $public;
    public function __construct(
        private HttpClientInterface $client,
        ParameterBagInterface $bag,
    ) {
        /**
         * @var string
         */
        $secret = $bag->get("app.recaptcha_secret_key");

        /**
         * @var string
         */
        $public = $bag->get("app.recaptcha_public_key");

        $this->secret = $secret;
        $this->public = $public;
    }

    public function validateRecaptcha(string $response): void
    {
        try {
            $response = $this->client->request(
                "POST",
                "https://www.google.com/recaptcha/api/siteverify",
                [
                    "headers" => [
                        "Accept" => "application/json",
                        "Content-Type" => "application/x-www-form-urlencoded",
                    ],
                    "body" => [
                        "secret" => $this->secret,
                        "response" => $response,
                    ],
                ]
            );
       

            $content = $response->getContent();
            $decoded = json_decode($content, true, 12, JSON_THROW_ON_ERROR);

            if (!is_array($decoded) || !array_key_exists("success", $decoded)) {
                throw new CaptchaTwsApiException("Decoding result payload filed or it's format is not valid");
            }

            if (!$decoded["success"]) {
                throw new CaptchaTwsApiException("Captcha validation filed - response is not success");
            }
        } catch (ClientException $e) {
            throw new CaptchaTwsApiException("HTTP client filed", $e);
        } catch (\JsonException $e) {
            throw new CaptchaTwsApiException("JSON decoding filed", $e);
        }
    }

    public function getPublicToken(): string
    {
        return $this->public;
    }
}
