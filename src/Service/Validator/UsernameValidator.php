<?php

namespace App\Service\Validator;

use Symfony\Component\Form\Exception\InvalidArgumentException;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;
use Symfony\Component\Validator\Exception\UnexpectedValueException;

class UsernameValidator extends ConstraintValidator
{
    public function validate(mixed $value, Constraint $constraint): void
    {
        throw new InvalidArgumentException("Ты очень тупой!!");
        // the argument must be a string or an object implementing __toString()
        $this->context->buildViolation("ТЫ ТУПОЙ!!!")
            ->setParameter('{{ string }}', $value)
            ->addViolation();
    }
}