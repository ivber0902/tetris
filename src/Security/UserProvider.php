<?php
declare(strict_types=1);


namespace App\Security;

use App\Repository\UserRepository;
use App\Security\SecurityUser;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;
use Symfony\Component\Security\Core\Exception\UserNotFoundException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;

class UserProvider implements UserProviderInterface
{
    private UserRepository $repository;

    public function __construct(UserRepository $repository)
    {
        $this->repository = $repository;
    }

    public function loadUserByUsername(string $username)
    {
        $user = $this->repository->findByLogin($username);
        if ($user === null) {
            throw new UserNotFoundException($username);
        }
        return new SecurityUser($user->getId(), $user->getLogin(), $user->getPassword());
    }

    /**
     * Метод loadUserByIdentifier() был представлен в Symfony 5.3.
     * В предыдущих версиях он назывался loadUserByUsername()
     *
     * Symfony вызывает этот метод, если вы используете функции вроде switch_user
     * или remember_me. Если вы не используете эти функции, вам не нужно реализовывать
     * этот метод.
     *
     * @throws UserNotFoundException, если пользователь не найден
     */
    public function loadUserByIdentifier(string $identifier): UserInterface
    {
        $user = $this->repository->findByLogin($identifier);
        if ($user === null) {
            throw new UserNotFoundException($identifier);
        }
        return new SecurityUser($user->getId(), $user->getLogin(), $user->getPassword());
    }

    /**
     * Обновляет пользователя после повторной загрузки из сессии.
     *
     * Когда пользователь вошел в систему, в начале каждого запроса, объект
     * User загружается из сессии, а затем вызывается этот метод. Ваша задача
     * - убедиться, что данные пользователя все еще свежие, путем, к примеру,
     * повторного запроса свежих данных пользователя.
     *
     * Если ваш файерволл "stateless: true" (для чистого API), этот метод
     * не вызывается.
     *
     * @return UserInterface
     */
    public function refreshUser(UserInterface $user): UserInterface
    {
        if (!$user instanceof SecurityUser) {
            throw new UnsupportedUserException(sprintf('Invalid user class "%s".', get_class($user)));
        }

        $currentUser = $this->repository->findByLogin($user->getUserIdentifier());
        if ($currentUser === null) {
            throw new UserNotFoundException($user->getUserIdentifier());
        }
        return new SecurityUser($user->getId(), $currentUser->getLogin(), $currentUser->getPassword(), $currentUser->getRole());
    }

    /**
     * Tells Symfony to use this provider for this User class.
     */
    public function supportsClass(string $class): bool
    {
        return SecurityUser::class === $class || is_subclass_of($class, SecurityUser::class);
    }

    /**
     * Обновляет зашифрованный пароль пользователя, обычно для использования лучшего алгоритма хеширования.
     */
    public function upgradePassword(UserInterface $user, string $newEncodedPassword): void
    {
        // СДЕЛАТЬ: когда используются хешированные пароли, этот метод должен:
        // 1. сохранять новый пароль в хранилище пользователя
        // 2. обновлять объект $user с $user->setPassword($newHashedPassword);
    }
}