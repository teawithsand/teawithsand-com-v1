<?php
declare(strict_types=1);

namespace App\Entity\User;

use Symfony\Component\Security\Core\User\UserInterface;

/**
 * App user, is any user, which uses app.
 * This may be: local user, facebook user, google user or any other kind of user, but
 * each of them has profile, which is common for all of them.
 */
interface AppUser extends UserInterface {
    function getUserProfile(): Profile\Profile;
    
    // TODO(teawithsand): function, which returns source that user is from like native or facebook or google etc...
    // function getSource();
}