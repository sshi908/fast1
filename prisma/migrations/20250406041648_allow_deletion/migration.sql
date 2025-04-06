-- DropForeignKey
ALTER TABLE "Experiment" DROP CONSTRAINT "Experiment_seedWordId_fkey";

-- DropForeignKey
ALTER TABLE "Experiment" DROP CONSTRAINT "Experiment_userId_fkey";

-- AlterTable
ALTER TABLE "Experiment" ALTER COLUMN "seedWordId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Experiment" ADD CONSTRAINT "Experiment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Experiment" ADD CONSTRAINT "Experiment_seedWordId_fkey" FOREIGN KEY ("seedWordId") REFERENCES "SeedWord"("id") ON DELETE SET NULL ON UPDATE CASCADE;
