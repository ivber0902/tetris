<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240705065906 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE player (user_id INT DEFAULT NULL, max_score INT NOT NULL, last_score INT NOT NULL, average_score INT NOT NULL, total_score INT NOT NULL, game_count INT NOT NULL, win_count INT NOT NULL, id INT AUTO_INCREMENT NOT NULL, UNIQUE INDEX UNIQ_98197A65A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('CREATE TABLE user (login VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL, player_id INT DEFAULT NULL, id INT AUTO_INCREMENT NOT NULL, UNIQUE INDEX UNIQ_8D93D64999E6F5DF (player_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('ALTER TABLE player ADD CONSTRAINT FK_98197A65A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE user ADD CONSTRAINT FK_8D93D64999E6F5DF FOREIGN KEY (player_id) REFERENCES player (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE player DROP FOREIGN KEY FK_98197A65A76ED395');
        $this->addSql('ALTER TABLE user DROP FOREIGN KEY FK_8D93D64999E6F5DF');
        $this->addSql('DROP TABLE player');
        $this->addSql('DROP TABLE user');
    }
}
