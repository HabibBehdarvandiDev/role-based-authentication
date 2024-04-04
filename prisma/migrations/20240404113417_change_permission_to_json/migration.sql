/*
  Warnings:

  - You are about to alter the column `permission` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `Json`.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `permission` JSON NOT NULL;
