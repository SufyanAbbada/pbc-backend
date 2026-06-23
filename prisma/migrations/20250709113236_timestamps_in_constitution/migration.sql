-- AlterTable
ALTER TABLE "Constitution" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "temporaryUser" ALTER COLUMN "emailOtpExpiry" SET DEFAULT now() + interval '30 minutes',
ALTER COLUMN "phoneOtpExpiry" SET DEFAULT now() + interval '30 minutes';
