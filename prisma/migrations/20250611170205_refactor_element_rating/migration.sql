-- DropForeignKey
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_elementId_fkey";

-- AlterTable
ALTER TABLE "Element" ADD COLUMN     "googleMapId" TEXT;

-- AlterTable
ALTER TABLE "Rating" ADD COLUMN     "googleMapId" TEXT;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_elementId_fkey" FOREIGN KEY ("elementId") REFERENCES "Element"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
