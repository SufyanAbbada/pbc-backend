-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.

begin;
ALTER TYPE "WishlistStatus" ADD VALUE 'RESOLVED_AND_CLOSED';
ALTER TYPE "WishlistStatus" ADD VALUE 'UNRESOLVED_AND_CLOSED';
commit;

-- AlterTable
ALTER TABLE "temporaryUser" ALTER COLUMN "emailOtpExpiry" SET DEFAULT now() + interval '30 minutes',
ALTER COLUMN "phoneOtpExpiry" SET DEFAULT now() + interval '30 minutes';
