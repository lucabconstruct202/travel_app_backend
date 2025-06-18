/*
  Warnings:

  - You are about to drop the column `name` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `programId` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Program` table. All the data in the column will be lost.
  - Added the required column `title` to the `Group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Program` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Group" DROP CONSTRAINT "Group_programId_fkey";

-- AlterTable
ALTER TABLE "Group" DROP COLUMN "name",
DROP COLUMN "position",
DROP COLUMN "programId",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Program" DROP COLUMN "name",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "startDate" TIMESTAMP(3),
ADD COLUMN     "title" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ProgramTimerange" (
    "id" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "programId" TEXT NOT NULL,

    CONSTRAINT "ProgramTimerange_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramTimerangeGroup" (
    "id" TEXT NOT NULL,
    "timerangeId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,

    CONSTRAINT "ProgramTimerangeGroup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProgramTimerangeGroup_timerangeId_groupId_key" ON "ProgramTimerangeGroup"("timerangeId", "groupId");

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramTimerange" ADD CONSTRAINT "ProgramTimerange_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramTimerangeGroup" ADD CONSTRAINT "ProgramTimerangeGroup_timerangeId_fkey" FOREIGN KEY ("timerangeId") REFERENCES "ProgramTimerange"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramTimerangeGroup" ADD CONSTRAINT "ProgramTimerangeGroup_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
