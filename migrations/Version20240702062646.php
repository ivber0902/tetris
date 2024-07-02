<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240702062646 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE player (user_id INT DEFAULT NULL, max_score INT NOT NULL, last_score INT NOT NULL, average_score INT NOT NULL, total_score INT NOT NULL, game_count INT NOT NULL, win_count INT NOT NULL, id INT AUTO_INCREMENT NOT NULL, UNIQUE INDEX UNIQ_98197A65A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('ALTER TABLE player ADD CONSTRAINT FK_98197A65A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('DROP TABLE orders');
        $this->addSql('DROP TABLE pizza');
        $this->addSql('ALTER TABLE user MODIFY user_id INT NOT NULL');
        $this->addSql('DROP INDEX UNIQ_8D93D649E7927C74 ON user');
        $this->addSql('DROP INDEX UNIQ_8D93D649444F97DD ON user');
        $this->addSql('DROP INDEX `primary` ON user');
        $this->addSql('ALTER TABLE user ADD player_id INT DEFAULT NULL, DROP role, DROP first_name, DROP last_name, DROP phone, DROP avatar_path, CHANGE email login VARCHAR(255) NOT NULL, CHANGE user_id id INT AUTO_INCREMENT NOT NULL');
        $this->addSql('ALTER TABLE user ADD CONSTRAINT FK_8D93D64999E6F5DF FOREIGN KEY (player_id) REFERENCES player (id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_8D93D64999E6F5DF ON user (player_id)');
        $this->addSql('ALTER TABLE user ADD PRIMARY KEY (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE orders (user_id INT NOT NULL, description VARCHAR(200) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, price INT NOT NULL, order_id INT AUTO_INCREMENT NOT NULL, PRIMARY KEY(order_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE pizza (pizza_name VARCHAR(200) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, description VARCHAR(200) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, weight INT NOT NULL, price INT NOT NULL, avatar_path VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, pizza_id INT AUTO_INCREMENT NOT NULL, PRIMARY KEY(pizza_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE player DROP FOREIGN KEY FK_98197A65A76ED395');
        $this->addSql('DROP TABLE player');
        $this->addSql('ALTER TABLE user MODIFY id INT NOT NULL');
        $this->addSql('ALTER TABLE user DROP FOREIGN KEY FK_8D93D64999E6F5DF');
        $this->addSql('DROP INDEX UNIQ_8D93D64999E6F5DF ON user');
        $this->addSql('DROP INDEX `PRIMARY` ON user');
        $this->addSql('ALTER TABLE user ADD role INT NOT NULL, ADD first_name VARCHAR(200) NOT NULL, ADD last_name VARCHAR(200) NOT NULL, ADD phone VARCHAR(255) DEFAULT NULL, ADD avatar_path VARCHAR(255) DEFAULT NULL, DROP player_id, CHANGE login email VARCHAR(255) NOT NULL, CHANGE id user_id INT AUTO_INCREMENT NOT NULL');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_8D93D649E7927C74 ON user (email)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_8D93D649444F97DD ON user (phone)');
        $this->addSql('ALTER TABLE user ADD PRIMARY KEY (user_id)');
    }
}
