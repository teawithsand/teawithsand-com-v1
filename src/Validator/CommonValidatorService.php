<?php

declare(strict_types=1);

namespace App\Validator;

class CommonValidatorService
{
    public function hasNullByte(string $string): bool
    {
        return strpos($string, "\0") !== false;
    }

    public function isValidUtf8(string $string): bool
    {
        // assume no null byte is allowed in strings here
        return !$this->hasNullByte($string) && preg_match('%^(?:
            [\x09\x0A\x0D\x20-\x7E]            # ASCII
            | [\xC2-\xDF][\x80-\xBF]             # non-overlong 2-byte
            | \xE0[\xA0-\xBF][\x80-\xBF]         # excluding overlongs
            | [\xE1-\xEC\xEE\xEF][\x80-\xBF]{2}  # straight 3-byte
            | \xED[\x80-\x9F][\x80-\xBF]         # excluding surrogates
            | \xF0[\x90-\xBF][\x80-\xBF]{2}      # planes 1-3
            | [\xF1-\xF3][\x80-\xBF]{3}          # planes 4-15
            | \xF4[\x80-\x8F][\x80-\xBF]{2}      # plane 16
        )*$%xs', $string) === 1;
    }

    public function isTrimmed(string $string): bool
    {
        return preg_match("/^\s/", $string) !== 1 || preg_match("/\s$/", $string) !== 1;
    }

    public function hasMultispace(string $string): bool
    {
        return preg_match("/\s{3}/", $string) === 1;
    }

    public function containsOnlyValidTitleChars(string $string): bool
    {
        return preg_match("/^[\S ]*$/", $string) === 1;
    }

    public function containsOnlyValidDescriptionChars(string $string): bool
    {
        return true;
        // return preg_match("/^[\S\n\t\v ]*$/", $string) === 1;
    }

    public function isValidTitle(string $string): bool
    {
        return $this->isValidUtf8($string) &&
            $this->isTrimmed($string) &&
            !$this->hasMultispace($string) &&
            $this->containsOnlyValidTitleChars($string);
    }

    public function isValidDescription(string $string): bool
    {
        return $this->isValidUtf8($string) &&
            $this->isTrimmed($string) &&
            $this->containsOnlyValidDescriptionChars($string);
    }

    public function strlen(string $string): int
    {
        $len = mb_strlen($string, "utf-8");
        if ($len === false) {
            return -1;
        }
        return $len;
    }
}
