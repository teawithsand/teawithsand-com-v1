<?php

namespace App\DataFixtures;

use App\Entity\Langka\WordSet;
use App\Entity\Langka\WordSetLifecycle;
use App\Entity\Langka\WordTuple;
use App\Entity\User\Native\NativeUser;
use App\Entity\User\Native\NativeUserRegistration;
use App\Entity\User\Profile\Profile;
use App\Entity\User\Profile\ProfileLifecycle;
use App\Service\User\UserNonceService;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Faker\Factory;

class UserFixtures extends Fixture
{
    private Factory $faker;
    public function __construct(
        private UserPasswordHasherInterface $hasher,
        private UserNonceService $userNonceService,
    ) {
        $this->faker = new Factory();
    }

    private function makeRegistration(
        string $name,
        string $email,
        string $password,
        string $emailConfirmNonce
    ): NativeUserRegistration {
        $r = new NativeUserRegistration;
        $r->setLogin($name);
        $r->setEmail($email);
        $r->setPassword(
            $this->hasher->hashPassword((new NativeUser)->setPassword($password), $password)
        );
        $r->setCreatedAt(new \DateTimeImmutable());
        $r->setEmailConfirmNonce($emailConfirmNonce);

        return $r;
    }

    private function makeUser(
        string $name,
        string $email,
        string $password,
    ): NativeUser {
        $profile = new Profile();
        $profile
            ->setPublicName($name)
            ->setLifecycle((new ProfileLifecycle)
                    ->setCreatedAt(new \DateTimeImmutable())
            )
            ->setRoles([Profile::ROLE_USER])
            ->setEmail($email)
            ->setRefreshTokenNonce($this->userNonceService->generateRefreshTokenNonce());

        $user = new NativeUser();
        $user->setCreatedAt(new \DateTimeImmutable());
        $user->setProfile($profile);
        $user->setLogin($name);
        $user->setPassword($password);
        $user->setPassword(
            $this->hasher->hashPassword($user, $password)
        );

        return $user;
    }

    public function load(ObjectManager $manager): void
    {
        $user = $this->makeUser(
            name: "userone",
            email: "userone@example.com",
            password: "userone"
        );
        $manager->persist($user);
        $manager->persist($user->getProfile());

        $user = $this->makeUser(
            name: "usertwo",
            email: "usertwo@example.com",
            password: "usertwo"
        );
        $manager->persist($user);
        $manager->persist($user->getProfile());

        $user = $this->makeUser(
            name: "userthree",
            email: "userthree@example.com",
            password: "userthree"
        );
        $manager->persist($user);
        $manager->persist($user->getProfile());

        $user = $this->makeUser(
            name: "admin",
            email: "admin@example.com",
            password: "admin"
        );
        $user->getProfile()->setRoles([
            Profile::ROLE_USER,
            Profile::ROLE_ADMIN
        ]);
        $manager->persist($user);
        $manager->persist($user->getProfile());

        $langkaUser = $this->makeUser(
            name: "langkauser",
            email: "langkauser@example.com",
            password: "langkauser"
        );
        $manager->persist($langkaUser);
        $manager->persist($langkaUser->getProfile());

        $langkaUserTwo = $this->makeUser(
            name: "langkausertwo",
            email: "langkausertwo@example.com",
            password: "langkausertwo"
        );
        $manager->persist($langkaUserTwo);
        $manager->persist($langkaUserTwo->getProfile());

        $registration = $this->makeRegistration(
            name: "reguserone",
            email: "reguserone@example.com",
            password: "reguserone",
            emailConfirmNonce: $this->userNonceService->generateEmailConfirmNonce(),
        );
        $manager->persist($registration);

        $registration = $this->makeRegistration(
            name: "reguserone_prim",
            email: "reguserone@example.com",
            password: "reguserone",
            emailConfirmNonce: $this->userNonceService->generateEmailConfirmNonce(),
        );
        $manager->persist($registration);

        $registration = $this->makeRegistration(
            name: "regusertwo",
            email: "regusertwo@example.com",
            password: "regusertwo",
            emailConfirmNonce: $this->userNonceService->generateEmailConfirmNonce(),
        );
        $manager->persist($registration);

        $this->makeLangkaFixtures(
            $manager,
            $langkaUser->getProfile(),
            $langkaUserTwo->getProfile(),
        );

        $manager->flush();
    }

    private function makeWordTuple(): WordTuple
    {
        $tuple = new WordTuple();
        $tuple->setSourceWord(base64_encode(random_bytes(3 * 3)));
        $tuple->setDestinationWords(
            join("|", [
                base64_encode(random_bytes(3 * 3)),
                base64_encode(random_bytes(3 * 3)),
                base64_encode(random_bytes(3 * 3)),
            ])
        );
        $tuple->setDescription(join(" ", [
            base64_encode(random_bytes(3 * 3)),
            base64_encode(random_bytes(3 * 3)),
            base64_encode(random_bytes(3 * 3)),
            base64_encode(random_bytes(3 * 3)),
            base64_encode(random_bytes(3 * 3)),
            base64_encode(random_bytes(3 * 3)),
            base64_encode(random_bytes(3 * 3)),
            base64_encode(random_bytes(3 * 3)),
            base64_encode(random_bytes(3 * 3)),
            base64_encode(random_bytes(3 * 3)),
            base64_encode(random_bytes(3 * 3)),
        ]));

        return $tuple;
    }

    private function makeLangkaFixtures(
        ObjectManager $manager,
        Profile $owner,
        Profile $secondOwner,
    ) {
        $wordSet = new WordSet;
        $wordSet->setTitle("Private wordset of 1st user");
        $wordSet->setDescription("Special one, since it's private");
        $wordSet->setLifecycle((new WordSetLifecycle)
            ->setCreatedAt(new \DateTimeImmutable()));
        $wordSet->setOwner($owner);
        $wordSet->setSourceLanguage("pl");
        $wordSet->setDestinationLanguage("en");

        for ($i = 0; $i < 10; $i++) {
            $wordSet->addWordTuple($this->makeWordTuple());
        }
        $manager->persist($wordSet);

        for ($i = 0; $i < 10; $i++) {
            $wordSet = new WordSet;
            $wordSet->setTitle("EN-PL public wordset #" . base64_encode(random_bytes(3 * 5)));
            $wordSet->setDescription("Wordset from pl to en example description");
            $wordSet->setLifecycle((new WordSetLifecycle)
                ->setCreatedAt(new \DateTimeImmutable())
                ->setPublishedAt(new \DateTimeImmutable()));
            $wordSet->setOwner($owner);
            $wordSet->setSourceLanguage("en");
            $wordSet->setDestinationLanguage("pl");

            for ($j = 0; $j < 20; $j++) {
                $wordSet->addWordTuple($this->makeWordTuple());
            }

            $manager->persist($wordSet);
        }

        for ($i = 0; $i < 10; $i++) {
            $wordSet = new WordSet;
            $wordSet->setTitle("FR-RU public wordset #" . base64_encode(random_bytes(3 * 5)));
            $wordSet->setDescription("Wordset from fr to ru example description by 2nd user; public");
            $wordSet->setLifecycle((new WordSetLifecycle)
                ->setCreatedAt(new \DateTimeImmutable())
                ->setPublishedAt(new \DateTimeImmutable()));
            $wordSet->setOwner($secondOwner);
            $wordSet->setSourceLanguage("fr");
            $wordSet->setDestinationLanguage("ru");

            for ($j = 0; $j < 20; $j++) {
                $wordSet->addWordTuple($this->makeWordTuple());
            }

            $manager->persist($wordSet);
        }
    }
}
