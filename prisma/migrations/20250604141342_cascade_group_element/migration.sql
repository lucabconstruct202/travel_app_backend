-- DropForeignKey
ALTER TABLE "GroupElement" DROP CONSTRAINT "GroupElement_elementId_fkey";

-- DropForeignKey
ALTER TABLE "GroupElement" DROP CONSTRAINT "GroupElement_groupId_fkey";

-- AddForeignKey
ALTER TABLE "GroupElement" ADD CONSTRAINT "GroupElement_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupElement" ADD CONSTRAINT "GroupElement_elementId_fkey" FOREIGN KEY ("elementId") REFERENCES "Element"("id") ON DELETE CASCADE ON UPDATE CASCADE;
