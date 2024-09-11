/*
  Warnings:

  - Made the column `slug` on table `Pergunta` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateTable
CREATE TABLE "Resposta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "corpo" TEXT NOT NULL,
    "perguntaId" INTEGER NOT NULL,
    CONSTRAINT "Resposta_perguntaId_fkey" FOREIGN KEY ("perguntaId") REFERENCES "Pergunta" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Pergunta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_Pergunta" ("created_at", "descricao", "id", "slug", "titulo", "updated_at") SELECT "created_at", "descricao", "id", "slug", "titulo", "updated_at" FROM "Pergunta";
DROP TABLE "Pergunta";
ALTER TABLE "new_Pergunta" RENAME TO "Pergunta";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
