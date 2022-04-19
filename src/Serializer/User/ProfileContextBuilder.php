<?php

declare(strict_types=1);

namespace App\Serializer\User;

use ApiPlatform\Core\Serializer\SerializerContextBuilderInterface;
use App\Entity\User\Profile\Profile;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

// TODO(teawithsand): remove this one in favour of detailed routes
final class ProfileContextBuilder implements SerializerContextBuilderInterface
{
    private $decorated;
    private $authorizationChecker;

    public function __construct(SerializerContextBuilderInterface $decorated, AuthorizationCheckerInterface $authorizationChecker)
    {
        $this->decorated = $decorated;
        $this->authorizationChecker = $authorizationChecker;
    }

    public function createFromRequest(Request $request, bool $normalization, ?array $extractedAttributes = null): array
    {

        $context = $this->decorated->createFromRequest($request, $normalization, $extractedAttributes);
        $resourceClass = $context['resource_class'] ?? null;

        if (
            $resourceClass === Profile::class &&
            isset($context['groups'])
        ) {
            $isAdmin = $this->authorizationChecker->isGranted(Profile::ROLE_ADMIN);
            if ($isAdmin) {
                if ($normalization) {
                    if (
                        in_array(Profile::GROUP_PUBLIC_DETAIL, $context, true) ||
                        in_array(Profile::GROUP_PRIVATE_DETAIL, $context, true)
                    ) {
                        $context['groups'][] = Profile::GROUP_ADMIN_DETAIL;
                    } else if (
                        in_array(Profile::GROUP_PUBLIC_SUMMARY, $context, true) ||
                        in_array(Profile::GROUP_PRIVATE_SUMMARY, $context, true)
                    ) {
                        $context['groups'][] = Profile::GROUP_ADMIN_SUMMARY;
                    }
                }
            }
        }

        return $context;
    }
}
