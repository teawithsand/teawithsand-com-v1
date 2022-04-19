<?php

namespace App\Tests\User;

use App\DataFixtures\UserFixtures;
use App\Entity\User\Native\NativeUserRegistration;
use App\Tests\BaseTestCase;

class NativeRegistrationTest extends BaseTestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        parent::setupBaseDeps();

        $this->databaseTool->loadFixtures([
            UserFixtures::class,
        ]);
    }

    public function testCreateUserRegistration()
    {
        $data = [
            "login" => "newuser",
            "password" => "newuserpassword",
            "email" => "newuseremail@example.com",
            "captchaResponse" => "iamnotarobot",
        ];

        $client = static::createClient();
        $res = $client->request('POST', '/api/v1/registrations', [
            'json' => $data,
        ]);

        $this->assertResponseStatusCodeSame(201);

        /**
         * @var NativeUserRegistration|null
         */
        $reg = $this->entityManager->getRepository(NativeUserRegistration::class)->findOneByLogin($data["login"]);
        $this->assertNotNull($reg);

        $emailConfirmNonce = $reg->getEmailConfirmNonce();
        $id = $reg->getId()->__toString();
        
        $client->request('POST', "/api/v1/registrations/$id/confirm", [
            'json' => [
                "emailConfirmNonce" => $emailConfirmNonce,
            ]
        ]);

        $this->assertResponseIsSuccessful();
    }
}
