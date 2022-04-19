<?php

namespace App\DataProvider;

use ApiPlatform\Core\DataProvider\ContextAwareCollectionDataProviderInterface;
use ApiPlatform\Core\DataProvider\RestrictedDataProviderInterface;

/**
 * Provider, which provides empty collections only for operation DTOs.
 */
class BlankDataProvider implements ContextAwareCollectionDataProviderInterface, RestrictedDataProviderInterface {
    public function supports(string $resourceClass, string $operationName = null, array $context = []): bool
    {
        return preg_match("/dto$/i", $resourceClass) === 1;
    }

    public function getCollection(string $resourceClass, string $operationName = null, array $context = []): iterable
    {
        return [];
    }
}