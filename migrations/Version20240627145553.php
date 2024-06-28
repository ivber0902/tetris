<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240627145553 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE player ADD last_score INT NOT NULL, CHANGE user_id user_id INT NOT NULL, CHANGE max_score max_score INT NOT NULL, CHANGE average_score average_score INT NOT NULL, CHANGE total_score total_score INT NOT NULL, CHANGE game_count game_count INT NOT NULL, CHANGE win_count win_count INT NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE player DROP last_score, CHANGE user_id user_id INT DEFAULT NULL, CHANGE max_score max_score INT DEFAULT NULL, CHANGE average_score average_score INT DEFAULT NULL, CHANGE total_score total_score INT DEFAULT NULL, CHANGE game_count game_count INT DEFAULT NULL, CHANGE win_count win_count INT DEFAULT NULL');
    }
}
