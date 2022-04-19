<?php

declare(strict_types=1);

namespace App\QueryExtensions\Langka;

use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use App\Entity\Langka\WordSet;
use App\Entity\User\AppUser;
use Doctrine\ORM\QueryBuilder;
use Symfony\Component\Security\Core\Security;

final class WordSetExtension implements QueryCollectionExtensionInterface
{
    public function __construct(
        private Security $security
    ) {
    }

    public function applyToCollection(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, string $operationName = null): void
    {
        $this->addWhere($queryBuilder, $resourceClass, $operationName ?? "");
    }

    /*
    public function applyToItem(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, array $identifiers, string $operationName = null, array $context = []): void
    {
        $this->addWhere($queryBuilder, $resourceClass, $operationName ?? "");
    }

    */
    private function addWhere(QueryBuilder $queryBuilder, string $resourceClass, string $operationName): void
    {
        if (WordSet::class !== $resourceClass) {
            return;
        }

        /**
         * @var AppUser|null
         */
        $user = $this->security->getUser();
        if (!($user instanceof AppUser)) {
            $user = null;
        }

        /*
        $rootAlias = $queryBuilder->getRootAliases()[0];
        $queryBuilder->andWhere(sprintf('%s.user = :current_user', $rootAlias));
        $queryBuilder->setParameter('current_user', $user->getId());
        */
        $rootAlias = $queryBuilder->getRootAliases()[0];

        if ($operationName === WordSet::COLLECTION_GET_OWNED) {
            if ($user === null) {
                // looks like api platform does request first
                // and then checks permission
                // so let's leave this as is
                $queryBuilder->andWhere("1 = 2");
            } else {
                dump($user->getUserProfile());
                $queryBuilder->andWhere("$rootAlias.owner = :user");
                $queryBuilder->setParameter('user', $user->getUserProfile()->getId()->toRfc4122());
            }
        } else if ($operationName === WordSet::COLLECTION_GET_PUBLIC) {
            $queryBuilder->andWhere("$rootAlias.lifecycle.publishedAt IS NOT NULL");
        }
    }
}
