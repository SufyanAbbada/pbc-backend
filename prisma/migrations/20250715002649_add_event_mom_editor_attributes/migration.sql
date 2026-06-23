-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "eventMOMEditorId" INTEGER;

-- AlterTable
ALTER TABLE "temporaryUser" ALTER COLUMN "emailOtpExpiry" SET DEFAULT now() + interval '30 minutes',
ALTER COLUMN "phoneOtpExpiry" SET DEFAULT now() + interval '30 minutes';

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_eventMOMEditorId_fkey" FOREIGN KEY ("eventMOMEditorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
