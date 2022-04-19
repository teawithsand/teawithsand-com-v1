<?php

namespace App\Tests\User;

use App\DataFixtures\UserFixtures;
use App\Entity\User\Native\NativeUserRegistration;
use App\Repository\User\Native\NativeUserRepository;
use App\Security\JWTConfig;
use App\Tests\BaseTestCase;

class TokensTest extends BaseTestCase
{
    private NativeUserRepository $repository;
    private JWTConfig $jwtConfig;
    protected function setUp(): void
    {
        parent::setUp();
        parent::setupBaseDeps();

        $this->databaseTool->loadFixtures([
            UserFixtures::class,
        ]);

        $this->repository = parent::getContainer()->get(NativeUserRepository::class);
        $this->jwtConfig = parent::getContainer()->get(JWTConfig::class);
    }

    public function testCanIssueRefreshTokenForUser()
    {
        $user = $this->repository->findOneByLogin("userone");

        $client = static::createClient();
        $client->request("POST", "/api/v1/token/refresh/issue", [
            'json' => [
                'login' => $user->getLogin(),
                'password' => $user->getLogin(),
            ]
        ]);
        $this->assertResponseIsSuccessful();
    }


    public function testCanIssueAuthTokenForUser()
    {
        $user = $this->repository->findOneByLogin("userone");

        $refreshToken = $this->jwtConfig->issueRefreshTokenForProfile($user->getProfile());

        $client = static::createClient();
        $res = $client->request("POST", "/api/v1/token/refresh/exchange", [
            'json' => [
                'token' => $refreshToken,
            ]
        ]);
        $this->assertResponseIsSuccessful();

        $token = $res->toArray()['token'];
        $res = $this->jwtConfig->parseAuthToken($token);
        $this->assertNotNull($res);
    }

    // TODO(teawithsand): invalid password tests
}
