-- Add video generation fields to ad_drafts
ALTER TABLE "ad_drafts" ADD COLUMN "videoUrl" TEXT;
ALTER TABLE "ad_drafts" ADD COLUMN "videoStatus" TEXT;
ALTER TABLE "ad_drafts" ADD COLUMN "videoJobId" TEXT;
ALTER TABLE "ad_drafts" ADD COLUMN "videoError" TEXT;

-- Add reference image URL to campaigns (for Luma AI style anchoring)
ALTER TABLE "campaigns" ADD COLUMN "referenceImageUrl" TEXT;
