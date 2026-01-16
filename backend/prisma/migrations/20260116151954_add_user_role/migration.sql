-- AlterTable
ALTER TABLE "Post" ADD COLUMN "blockedAt" DATETIME;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nick" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" TEXT NOT NULL DEFAULT 'DEFAULT'
);
INSERT INTO "new_User" ("createdAt", "id", "name", "nick", "password") SELECT "createdAt", "id", "name", "nick", "password" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_nick_key" ON "User"("nick");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
