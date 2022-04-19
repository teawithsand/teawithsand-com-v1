<?php
declare(strict_types=1);

namespace App\Security\Token\Exception;

use App\Service\Error\TwsApiException;

class InvalidFormatParseTokenTwsApiException extends ParseTokenTwsApiException {}