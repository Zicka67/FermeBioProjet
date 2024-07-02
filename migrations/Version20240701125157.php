<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240701125157 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE dynamic_text (id INT AUTO_INCREMENT NOT NULL, button_text VARCHAR(255) NOT NULL, blurred_section_text LONGTEXT NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE cart_item DROP FOREIGN KEY FK_F0FE25271AD5CDBF');
        $this->addSql('ALTER TABLE cart_item ADD CONSTRAINT FK_F0FE25271AD5CDBF FOREIGN KEY (cart_id) REFERENCES cart (id)');
        $this->addSql('ALTER TABLE reservation DROP FOREIGN KEY FK_42C849551AD5CDBF');
        $this->addSql('ALTER TABLE reservation DROP FOREIGN KEY FK_42C84955D62B0FA');
        $this->addSql('ALTER TABLE reservation ADD CONSTRAINT FK_42C849551AD5CDBF FOREIGN KEY (cart_id) REFERENCES cart (id)');
        $this->addSql('ALTER TABLE reservation ADD CONSTRAINT FK_42C84955D62B0FA FOREIGN KEY (time_slot_id) REFERENCES time_slot (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE dynamic_text');
        $this->addSql('ALTER TABLE reservation DROP FOREIGN KEY FK_42C849551AD5CDBF');
        $this->addSql('ALTER TABLE reservation DROP FOREIGN KEY FK_42C84955D62B0FA');
        $this->addSql('ALTER TABLE reservation ADD CONSTRAINT FK_42C849551AD5CDBF FOREIGN KEY (cart_id) REFERENCES cart (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('ALTER TABLE reservation ADD CONSTRAINT FK_42C84955D62B0FA FOREIGN KEY (time_slot_id) REFERENCES time_slot (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('ALTER TABLE cart_item DROP FOREIGN KEY FK_F0FE25271AD5CDBF');
        $this->addSql('ALTER TABLE cart_item ADD CONSTRAINT FK_F0FE25271AD5CDBF FOREIGN KEY (cart_id) REFERENCES cart (id) ON UPDATE NO ACTION ON DELETE CASCADE');
    }
}
