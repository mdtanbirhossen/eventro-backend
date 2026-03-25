/*
  Warnings:

  - The values [SUPER_ADMIN,DOCTOR,PATIENT] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `appointmentId` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `appointmentId` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `doctorId` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `patientId` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the `admins` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `appointments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `doctor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `doctor_schedules` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `doctor_specialties` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `medical_reports` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `patient` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `patient_health_data` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `prescriptions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `schedules` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `specialties` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('ADMIN', 'USER');
ALTER TABLE "public"."user" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "user" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'USER';
COMMIT;

-- DropForeignKey
ALTER TABLE "admins" DROP CONSTRAINT "admins_userId_fkey";

-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_patientId_fkey";

-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_scheduleId_fkey";

-- DropForeignKey
ALTER TABLE "doctor" DROP CONSTRAINT "doctor_userId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_schedules" DROP CONSTRAINT "doctor_schedules_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_schedules" DROP CONSTRAINT "doctor_schedules_scheduleId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_specialties" DROP CONSTRAINT "doctor_specialties_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_specialties" DROP CONSTRAINT "doctor_specialties_specialtyId_fkey";

-- DropForeignKey
ALTER TABLE "medical_reports" DROP CONSTRAINT "medical_reports_patientId_fkey";

-- DropForeignKey
ALTER TABLE "patient" DROP CONSTRAINT "patient_userId_fkey";

-- DropForeignKey
ALTER TABLE "patient_health_data" DROP CONSTRAINT "patient_health_data_patientId_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_appointmentId_fkey";

-- DropForeignKey
ALTER TABLE "prescriptions" DROP CONSTRAINT "prescriptions_appointmentId_fkey";

-- DropForeignKey
ALTER TABLE "prescriptions" DROP CONSTRAINT "prescriptions_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "prescriptions" DROP CONSTRAINT "prescriptions_patientId_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_appointmentId_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_patientId_fkey";

-- DropIndex
DROP INDEX "payments_appointmentId_idx";

-- DropIndex
DROP INDEX "payments_appointmentId_key";

-- DropIndex
DROP INDEX "reviews_appointmentId_idx";

-- DropIndex
DROP INDEX "reviews_appointmentId_key";

-- DropIndex
DROP INDEX "reviews_doctorId_idx";

-- DropIndex
DROP INDEX "reviews_patientId_idx";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "appointmentId";

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "appointmentId",
DROP COLUMN "doctorId",
DROP COLUMN "patientId";

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'USER';

-- DropTable
DROP TABLE "admins";

-- DropTable
DROP TABLE "appointments";

-- DropTable
DROP TABLE "doctor";

-- DropTable
DROP TABLE "doctor_schedules";

-- DropTable
DROP TABLE "doctor_specialties";

-- DropTable
DROP TABLE "medical_reports";

-- DropTable
DROP TABLE "patient";

-- DropTable
DROP TABLE "patient_health_data";

-- DropTable
DROP TABLE "prescriptions";

-- DropTable
DROP TABLE "schedules";

-- DropTable
DROP TABLE "specialties";

-- DropEnum
DROP TYPE "AppointmentStatus";

-- DropEnum
DROP TYPE "BloodGroup";
