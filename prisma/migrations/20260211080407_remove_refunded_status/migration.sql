-- AlterEnum
BEGIN;
CREATE TYPE "PaymentStatus_new" AS ENUM ('PENDING', 'DETECTED', 'CONFIRMING', 'UNDERPAID', 'OVERPAID', 'COMPLETED', 'EXPIRED', 'CANCELLED');
ALTER TABLE "public"."payments" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "payments" ALTER COLUMN "status" TYPE "PaymentStatus_new" USING ("status"::text::"PaymentStatus_new");
ALTER TYPE "PaymentStatus" RENAME TO "PaymentStatus_old";
ALTER TYPE "PaymentStatus_new" RENAME TO "PaymentStatus";
DROP TYPE "public"."PaymentStatus_old";
ALTER TABLE "payments" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;
