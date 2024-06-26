<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240625123938 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<sql
            ALTER TABLE `player`
            MODIFY `max_score` INT DEFAULT 0;
            ALTER TABLE `player`
            MODIFY `average_score` INT DEFAULT 0;
            ALTER TABLE `player`
            MODIFY `total_score` INT DEFAULT 0;
            ALTER TABLE `player`
            MODIFY `game_count` INT DEFAULT 0;
            ALTER TABLE `player`
            MODIFY `win_count` INT DEFAULT 0;
        sql);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<sql
            ALTER TABLE `player`
            MODIFY `max_score` INT DEFAULT NULL;
            ALTER TABLE `player`
            MODIFY `average_score` INT DEFAULT NULL;
            ALTER TABLE `player`
            MODIFY `total_score` INT DEFAULT NULL;
            ALTER TABLE `player`
            MODIFY `game_count` INT DEFAULT NULL;
            ALTER TABLE `player`
            MODIFY `win_count` INT DEFAULT NULL;
        sql);
    }
}
