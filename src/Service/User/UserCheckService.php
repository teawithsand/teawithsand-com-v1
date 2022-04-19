<?php

namespace App\Service\User;

use App\Entity\User\AppUser;

class UserCheckService {
    public function canUserLogin(AppUser $user): bool {
        $profile = $user->getUserProfile();

        if($profile->getLifecycle()->getLockedAt() !== null)
            return false;
        return true;
    }
}