<?php

namespace App\Tests\User;

use App\DataFixtures\UserFixtures;
use App\Entity\User\Native\NativeUser;
use App\Entity\User\Native\NativeUserRegistration;
use App\Entity\User\Profile\Profile;
use App\Security\JWTConfig;
use App\Security\Token\ApiTokenData;
use App\Security\Token\TokenIssueService;
use App\Tests\BaseTestCase;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class ChangeEmailTest extends BaseTestCase
{
    private TokenIssueService $tokenIssueService;
    
    protected function setUp(): void
    {
        parent::setUp();
        parent::setupBaseDeps();

        $this->databaseTool->loadFixtures([
            UserFixtures::class,
        ]);

        $this->tokenIssueService = $this->getContainer()->get(TokenIssueService::class);
    }

    public function testCanChangeUserEmail_WithValidToken()
    {
        $username = "userone";
        $email = "newunusedemail@example.com";

        /**
         * @var JWTConfig
         */
        $config = self::getContainer()->get(JWTConfig::class);


        /**
         * @var Profile
         */
        $profileBefore = $this->entityManager->getRepository(Profile::class)->findOneByPublicName($username);

        $token = $this->tokenIssueService->issueSignedApiToken(new ApiTokenData(
            profileId: $profileBefore->getId(),
            nonce: $profileBefore->getRefreshTokenNonce(),
            kind: ApiTokenData::KIND_REFRESH
        ));

        [$header, $headerValue] = $config->getAuthHeaderForToken($token);

        $client = static::createClient();
        $client->request('POST', '/api/v1/profiles/' . $profileBefore->getId()->__toString() . '/change-email', [
            'headers' => [
                $header => $headerValue
            ],
            'json' => [
                'captchaResponse' => "iamnotarobot",
                "email" => $email,
            ],
        ]);

        /**
         * @var Profile
         */
        $profileAfter = $this->entityManager->getRepository(Profile::class)->findOneByPublicName($username);

        $this->assertEmailCount(1);
        $this->assertResponseIsSuccessful();

        $this->assertNotEquals(
            $profileBefore->getEmailConfirmData()->getEmailConfirmNonce(),
            $profileAfter->getEmailConfirmData()->getEmailConfirmNonce(),
        );

        $this->assertNotEquals($profileBefore->getEmail(), $profileAfter->getEmail());

        $client->request('POST', '/api/v1/profiles/' . $profileBefore->getId()->__toString() . '/confirm-email', [
            'headers' => [
                $header => $headerValue
            ],
            'json' => [
                'emailConfirmNonce' => $profileAfter->getEmailConfirmData()->getEmailConfirmNonce(),
            ],
        ]);

        $profileAfter = $this->entityManager->getRepository(Profile::class)->findOneByPublicName($username);

        $this->assertResponseIsSuccessful();
        $this->assertEquals($profileAfter->getEmail(), $email);
    }

    public function testCantChangeUserEmail_WhenInUse_WithValidToken()
    {
        $username = "userone";

        /**
         * @var JWTConfig
         */
        $config = self::getContainer()->get(JWTConfig::class);

        $usingProfile = $this->entityManager->getRepository(Profile::class)->findOneByPublicName("usertwo");
        $email = $usingProfile->getEmail();

        $profile = $this->entityManager->getRepository(Profile::class)->findOneByPublicName($username);

        $token = $this->tokenIssueService->issueSignedApiToken(new ApiTokenData(
            profileId: $profile->getId(),
            nonce: $profile->getRefreshTokenNonce(),
            kind: ApiTokenData::KIND_REFRESH
        ));

        [$header, $headerValue] = $config->getAuthHeaderForToken($token);

        $client = static::createClient();
        $client->request('POST', '/api/v1/profiles/' . $profile->getId()->__toString() . '/change-email', [
            'headers' => [
                $header => $headerValue
            ],
            'json' => [
                'captchaResponse' => "iamnotarobot",
                "email" => $email,
            ],
        ]);

        $this->assertResponseStatusCodeSame(403);
    }

    public function testCanResend_ConfirmEmail()
    {
        $username = "userone";
        $email = "newunusedemail@example.com";

        /**
         * @var JWTConfig
         */
        $config = self::getContainer()->get(JWTConfig::class);


        /**
         * @var Profile
         */
        $profileBefore = $this->entityManager->getRepository(Profile::class)->findOneByPublicName($username);

        $token = $this->tokenIssueService->issueSignedApiToken(new ApiTokenData(
            profileId: $profileBefore->getId(),
            nonce: $profileBefore->getRefreshTokenNonce(),
            kind: ApiTokenData::KIND_REFRESH
        ));

        [$header, $headerValue] = $config->getAuthHeaderForToken($token);

        $client = static::createClient();
        $client->request('POST', '/api/v1/profiles/' . $profileBefore->getId()->__toString() . '/change-email', [
            'headers' => [
                $header => $headerValue
            ],
            'json' => [
                'captchaResponse' => "iamnotarobot",
                "email" => $email,
            ],
        ]);

        $this->assertEmailCount(1);
        $this->assertResponseIsSuccessful();

        $client->request('POST', '/api/v1/profiles/' . $profileBefore->getId()->__toString() . '/resend-confirm-email', [
            'headers' => [
                $header => $headerValue
            ],
            'json' => [
                'captchaResponse' => "iamnotarobot",
            ],
        ]);   
        
        $this->assertResponseIsSuccessful();
        // $this->assertEmailCount(2); // TOOD(teawithsand): make this test pass
    }
}
