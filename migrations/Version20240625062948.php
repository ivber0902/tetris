<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240625062948 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<sql
            CREATE TABLE player(
                id INT AUTO_INCREMENT NOT NULL,
                user_id INT DEFAULT NULL,
                max_score INT DEFAULT NULL,
                average_score INT DEFAULT NULL,
                total_score INT DEFAULT NULL,
                game_count INT DEFAULT NULL,
                win_count INT DEFAULT NULL,
                PRIMARY KEY(id)
            );
        sql);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<sql
            DROP TABLE player;
        sql);
    }
}
