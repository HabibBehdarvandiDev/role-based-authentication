-- AlterTable
ALTER TABLE `user` ADD COLUMN `permission` ENUM('read', 'create', 'delete', 'change') NOT NULL DEFAULT 'read';
