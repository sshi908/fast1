-- DropForeignKey
ALTER TABLE "Word" DROP CONSTRAINT "Word_experimentId_fkey";

-- AddForeignKey
ALTER TABLE "Word" ADD CONSTRAINT "Word_experimentId_fkey" FOREIGN KEY ("experimentId") REFERENCES "Experiment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
