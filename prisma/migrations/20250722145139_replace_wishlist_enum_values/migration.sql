/*
  Warnings:

  - The values [APPROVED,REJECTED] on the enum `WishlistStatus` will be removed. If these variants are still used in the database, this will fail.

*/

-- update enum values
UPDATE "Wishlist" SET "status" = 'RESOLVED_AND_CLOSED' WHERE "status" = 'APPROVED';
UPDATE "Wishlist" SET "status" = 'UNRESOLVED_AND_CLOSED' WHERE "status" = 'REJECTED';

-- AlterEnum
BEGIN;
CREATE TYPE "WishlistStatus_new" AS ENUM ('PENDING', 'RESOLVED_AND_CLOSED', 'UNRESOLVED_AND_CLOSED');
ALTER TABLE "Wishlist" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Wishlist" ALTER COLUMN "status" TYPE "WishlistStatus_new" USING ("status"::text::"WishlistStatus_new");
ALTER TYPE "WishlistStatus" RENAME TO "WishlistStatus_old";
ALTER TYPE "WishlistStatus_new" RENAME TO "WishlistStatus";
DROP TYPE "WishlistStatus_old";
ALTER TABLE "Wishlist" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "temporaryUser" ALTER COLUMN "emailOtpExpiry" SET DEFAULT now() + interval '30 minutes',
ALTER COLUMN "phoneOtpExpiry" SET DEFAULT now() + interval '30 minutes';
