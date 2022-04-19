<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220307110803 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE facebook_user_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE facebook_user (id INT NOT NULL, profile_id UUID NOT NULL, facebook_id VARCHAR(255) NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_9E6AD5849BE8FD98 ON facebook_user (facebook_id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_9E6AD584CCFA12B8 ON facebook_user (profile_id)');
        $this->addSql('COMMENT ON COLUMN facebook_user.profile_id IS \'(DC2Type:ulid)\'');
        $this->addSql('COMMENT ON COLUMN facebook_user.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('CREATE TABLE native_user (id UUID NOT NULL, profile_id UUID NOT NULL, login VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_F4FE6062AA08CB10 ON native_user (login)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_F4FE6062CCFA12B8 ON native_user (profile_id)');
        $this->addSql('COMMENT ON COLUMN native_user.id IS \'(DC2Type:ulid)\'');
        $this->addSql('COMMENT ON COLUMN native_user.profile_id IS \'(DC2Type:ulid)\'');
        $this->addSql('COMMENT ON COLUMN native_user.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('CREATE TABLE native_user_registration (id UUID NOT NULL, login VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, email_confirm_nonce VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_BC1CA69AAA08CB10 ON native_user_registration (login)');
        $this->addSql('COMMENT ON COLUMN native_user_registration.id IS \'(DC2Type:ulid)\'');
        $this->addSql('COMMENT ON COLUMN native_user_registration.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('CREATE TABLE profile (id UUID NOT NULL, email VARCHAR(255) DEFAULT NULL, public_name VARCHAR(255) NOT NULL, roles TEXT NOT NULL, refresh_token_nonce VARCHAR(64) NOT NULL, email_email_confirmed_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, email_email_confirm_nonce VARCHAR(255) DEFAULT NULL, lifecycle_created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, lifecycle_locked_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, second_factor_totp_secret VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_8157AA0FE7927C74 ON profile (email)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_8157AA0F257E3CD7 ON profile (public_name)');
        $this->addSql('COMMENT ON COLUMN profile.id IS \'(DC2Type:ulid)\'');
        $this->addSql('COMMENT ON COLUMN profile.roles IS \'(DC2Type:array)\'');
        $this->addSql('COMMENT ON COLUMN profile.lifecycle_created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('COMMENT ON COLUMN profile.lifecycle_locked_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('CREATE TABLE word_set (id UUID NOT NULL, owner_id UUID DEFAULT NULL, title VARCHAR(255) NOT NULL, source_language VARCHAR(2) NOT NULL, destination_language VARCHAR(2) NOT NULL, description TEXT NOT NULL, lifecycle_created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, lifecycle_published_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_1E2AE5912B36786B ON word_set (title)');
        $this->addSql('CREATE INDEX IDX_1E2AE5917E3C61F9 ON word_set (owner_id)');
        $this->addSql('COMMENT ON COLUMN word_set.id IS \'(DC2Type:ulid)\'');
        $this->addSql('COMMENT ON COLUMN word_set.owner_id IS \'(DC2Type:ulid)\'');
        $this->addSql('COMMENT ON COLUMN word_set.lifecycle_created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('COMMENT ON COLUMN word_set.lifecycle_published_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('CREATE TABLE word_tuple (id UUID NOT NULL, word_set_id UUID DEFAULT NULL, source_word VARCHAR(255) NOT NULL, destination_words TEXT NOT NULL, description TEXT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_E84333566222D996 ON word_tuple (word_set_id)');
        $this->addSql('COMMENT ON COLUMN word_tuple.id IS \'(DC2Type:ulid)\'');
        $this->addSql('COMMENT ON COLUMN word_tuple.word_set_id IS \'(DC2Type:ulid)\'');
        $this->addSql('ALTER TABLE facebook_user ADD CONSTRAINT FK_9E6AD584CCFA12B8 FOREIGN KEY (profile_id) REFERENCES profile (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE native_user ADD CONSTRAINT FK_F4FE6062CCFA12B8 FOREIGN KEY (profile_id) REFERENCES profile (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE word_set ADD CONSTRAINT FK_1E2AE5917E3C61F9 FOREIGN KEY (owner_id) REFERENCES profile (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE word_tuple ADD CONSTRAINT FK_E84333566222D996 FOREIGN KEY (word_set_id) REFERENCES word_set (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE facebook_user DROP CONSTRAINT FK_9E6AD584CCFA12B8');
        $this->addSql('ALTER TABLE native_user DROP CONSTRAINT FK_F4FE6062CCFA12B8');
        $this->addSql('ALTER TABLE word_set DROP CONSTRAINT FK_1E2AE5917E3C61F9');
        $this->addSql('ALTER TABLE word_tuple DROP CONSTRAINT FK_E84333566222D996');
        $this->addSql('DROP SEQUENCE facebook_user_id_seq CASCADE');
        $this->addSql('DROP TABLE facebook_user');
        $this->addSql('DROP TABLE native_user');
        $this->addSql('DROP TABLE native_user_registration');
        $this->addSql('DROP TABLE profile');
        $this->addSql('DROP TABLE word_set');
        $this->addSql('DROP TABLE word_tuple');
    }
}
