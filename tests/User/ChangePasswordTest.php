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

class ChangePasswordTest extends BaseTestCase
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

    public function testCanChangeUserPassword_WithValidToken()
    {
        $username = "userone";
        $password = "newuseronepassword!!AA";

        /**
         * @var JWTConfig
         */
        $config = self::getContainer()->get(JWTConfig::class);


        $profile = $this->entityManager->getRepository(Profile::class)->findOneByPublicName($username);

        $token = $this->tokenIssueService->issueSignedApiToken(new ApiTokenData(
            profileId: $profile->getId(),
            nonce: $profile->getRefreshTokenNonce(),
            kind: ApiTokenData::KIND_REFRESH
        ));

        [$header, $headerValue] = $config->getAuthHeaderForToken($token);

        $client = static::createClient();
        $res = $client->request('POST', '/api/v1/profiles/' . $profile->getId()->__toString() . '/native/change-password', [
            'headers' => [
                $header => $headerValue
            ],
            'json' => [
                'password' => $password,
            ],
        ]);

        $this->assertResponseIsSuccessful();

        $user = $this->entityManager->getRepository(NativeUser::class)->findOneByProfile($profile);

        $hasher = self::getContainer()->get(UserPasswordHasherInterface::class);
        $this->assertTrue($hasher->isPasswordValid($user, $password));
    }

    public function testCantChangeUserPassword_WithInvalidToken()
    {
        $hackerUsername = "usertwo";
        $username = "userone";
        $password = "newuseronepassword!!AA";

        /**
         * @var JWTConfig
         */
        $config = self::getContainer()->get(JWTConfig::class);

        $hackerProfile = $this->entityManager->getRepository(Profile::class)->findOneByPublicName($hackerUsername);
        
        $token = $this->tokenIssueService->issueSignedApiToken(new ApiTokenData(
            profileId: $hackerProfile->getId(),
            nonce: $hackerProfile->getRefreshTokenNonce(),
            kind: ApiTokenData::KIND_REFRESH
        ));

        [$header, $headerValue] = $config->getAuthHeaderForToken($token);

        $profile = $this->entityManager->getRepository(Profile::class)->findOneByPublicName($username);


        $client = static::createClient();
        $res = $client->request('POST', '/api/v1/profiles/' . $profile->getId()->__toString() . '/native/change-password', [
            'headers' => [
                $header => $headerValue
            ],
            'json' => [
                'password' => $password,
            ],
        ]);

        $this->assertResponseStatusCodeSame(403);
    }
}
