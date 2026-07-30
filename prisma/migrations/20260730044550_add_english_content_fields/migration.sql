-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "nameEn" TEXT;

-- AlterTable
ALTER TABLE "Dish" ADD COLUMN     "descriptionEn" TEXT,
ADD COLUMN     "nameEn" TEXT;

-- AlterTable
ALTER TABLE "Promotion" ADD COLUMN     "badgeLabelEn" TEXT,
ADD COLUMN     "badgeOfferEn" TEXT,
ADD COLUMN     "descriptionEn" TEXT,
ADD COLUMN     "scheduleTextEn" TEXT,
ADD COLUMN     "titleEn" TEXT;
