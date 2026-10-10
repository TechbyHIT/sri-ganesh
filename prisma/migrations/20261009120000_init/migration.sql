-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "public"."Business" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "legalName" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "phone" TEXT NOT NULL DEFAULT '',
    "whatsapp" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ServiceCategory" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ServiceCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Service" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "publicationStatus" TEXT NOT NULL DEFAULT 'draft',
    "allowIndexing" BOOLEAN NOT NULL DEFAULT false,
    "summary" TEXT NOT NULL,
    "introduction" TEXT NOT NULL,
    "detailedDescription" TEXT NOT NULL,
    "contentReviewed" BOOLEAN NOT NULL DEFAULT false,
    "qualityScore" INTEGER NOT NULL DEFAULT 0,
    "heroImage" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Location" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "locationType" TEXT NOT NULL,
    "parentId" TEXT,
    "state" TEXT NOT NULL,
    "district" TEXT,
    "publicationStatus" TEXT NOT NULL DEFAULT 'draft',
    "allowIndexing" BOOLEAN NOT NULL DEFAULT false,
    "isServed" BOOLEAN NOT NULL DEFAULT false,
    "introduction" TEXT NOT NULL,
    "localDescription" TEXT NOT NULL,
    "localDataVerified" BOOLEAN NOT NULL DEFAULT false,
    "contentReviewed" BOOLEAN NOT NULL DEFAULT false,
    "qualityScore" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Area" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "introduction" TEXT NOT NULL,
    "isServed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Area_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Landmark" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "locationId" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Landmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PropertyType" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "PropertyType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Problem" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Problem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Page" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "pageType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "metaDescription" TEXT NOT NULL,
    "h1" TEXT NOT NULL,
    "canonicalUrl" TEXT NOT NULL,
    "serviceId" TEXT,
    "locationId" TEXT,
    "areaId" TEXT,
    "propertyTypeId" TEXT,
    "problemId" TEXT,
    "publicationStatus" TEXT NOT NULL DEFAULT 'draft',
    "allowIndexing" BOOLEAN NOT NULL DEFAULT false,
    "contentReviewed" BOOLEAN NOT NULL DEFAULT false,
    "localDataVerified" BOOLEAN NOT NULL DEFAULT false,
    "qualityScore" INTEGER NOT NULL DEFAULT 0,
    "similarityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "wordCount" INTEGER NOT NULL DEFAULT 0,
    "minimumWordCount" INTEGER NOT NULL DEFAULT 80,
    "hasUniqueMetadata" BOOLEAN NOT NULL DEFAULT false,
    "hasUniqueContent" BOOLEAN NOT NULL DEFAULT false,
    "hasValidCanonical" BOOLEAN NOT NULL DEFAULT false,
    "hasInternalLinks" BOOLEAN NOT NULL DEFAULT false,
    "hasValidSchema" BOOLEAN NOT NULL DEFAULT false,
    "crawlPriority" TEXT NOT NULL DEFAULT 'low',
    "sitemapGroup" TEXT,
    "lastContentChangeAt" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),
    "lastReviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "batchId" TEXT,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PageContent" (
    "id" TEXT NOT NULL,
    "pageId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "modules" TEXT NOT NULL,

    CONSTRAINT "PageContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ContentModule" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "pageType" TEXT NOT NULL,

    CONSTRAINT "ContentModule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FAQ" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "serviceSlug" TEXT,
    "locationSlug" TEXT,

    CONSTRAINT "FAQ_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BlogCategory" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "BlogCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Author" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Author_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BlogPost" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "categoryId" TEXT,
    "authorId" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Project" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Testimonial" (
    "id" TEXT NOT NULL,
    "quote" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Redirect" (
    "id" TEXT NOT NULL,
    "fromPath" TEXT NOT NULL,
    "toPath" TEXT NOT NULL,
    "statusCode" INTEGER NOT NULL DEFAULT 308,

    CONSTRAINT "Redirect_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."InternalLink" (
    "id" TEXT NOT NULL,
    "fromPageId" TEXT NOT NULL,
    "toPageId" TEXT NOT NULL,
    "anchor" TEXT NOT NULL,

    CONSTRAINT "InternalLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SitemapEntry" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "group" TEXT NOT NULL,
    "lastmod" TIMESTAMP(3) NOT NULL,
    "priority" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "SitemapEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PageAudit" (
    "id" TEXT NOT NULL,
    "pageId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "passed" BOOLEAN NOT NULL,
    "detail" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PageAudit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PublishingBatch" (
    "id" TEXT NOT NULL,
    "phase" INTEGER NOT NULL,
    "size" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PublishingBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ContactInquiry" (
    "id" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL DEFAULT '',
    "serviceSlug" TEXT NOT NULL,
    "citySlug" TEXT NOT NULL,
    "areaSlug" TEXT NOT NULL DEFAULT '',
    "propertyType" TEXT NOT NULL DEFAULT '',
    "message" TEXT NOT NULL,
    "consent" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactInquiry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ServiceCategory_slug_key" ON "public"."ServiceCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Service_slug_key" ON "public"."Service"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Location_slug_key" ON "public"."Location"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Area_locationId_slug_key" ON "public"."Area"("locationId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "Landmark_slug_key" ON "public"."Landmark"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "PropertyType_slug_key" ON "public"."PropertyType"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Problem_slug_key" ON "public"."Problem"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Page_path_key" ON "public"."Page"("path");

-- CreateIndex
CREATE UNIQUE INDEX "Page_canonicalUrl_key" ON "public"."Page"("canonicalUrl");

-- CreateIndex
CREATE INDEX "Page_pageType_idx" ON "public"."Page"("pageType");

-- CreateIndex
CREATE INDEX "Page_publicationStatus_idx" ON "public"."Page"("publicationStatus");

-- CreateIndex
CREATE INDEX "Page_allowIndexing_idx" ON "public"."Page"("allowIndexing");

-- CreateIndex
CREATE INDEX "Page_serviceId_idx" ON "public"."Page"("serviceId");

-- CreateIndex
CREATE INDEX "Page_locationId_idx" ON "public"."Page"("locationId");

-- CreateIndex
CREATE INDEX "Page_areaId_idx" ON "public"."Page"("areaId");

-- CreateIndex
CREATE INDEX "Page_qualityScore_idx" ON "public"."Page"("qualityScore");

-- CreateIndex
CREATE INDEX "Page_crawlPriority_idx" ON "public"."Page"("crawlPriority");

-- CreateIndex
CREATE INDEX "Page_updatedAt_idx" ON "public"."Page"("updatedAt");

-- CreateIndex
CREATE INDEX "Page_sitemapGroup_idx" ON "public"."Page"("sitemapGroup");

-- CreateIndex
CREATE UNIQUE INDEX "PageContent_pageId_key" ON "public"."PageContent"("pageId");

-- CreateIndex
CREATE UNIQUE INDEX "ContentModule_key_key" ON "public"."ContentModule"("key");

-- CreateIndex
CREATE UNIQUE INDEX "BlogCategory_slug_key" ON "public"."BlogCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Author_slug_key" ON "public"."Author"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "public"."BlogPost"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "public"."Project"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Redirect_fromPath_key" ON "public"."Redirect"("fromPath");

-- CreateIndex
CREATE INDEX "InternalLink_fromPageId_idx" ON "public"."InternalLink"("fromPageId");

-- CreateIndex
CREATE INDEX "InternalLink_toPageId_idx" ON "public"."InternalLink"("toPageId");

-- CreateIndex
CREATE UNIQUE INDEX "SitemapEntry_path_key" ON "public"."SitemapEntry"("path");

-- CreateIndex
CREATE INDEX "SitemapEntry_group_idx" ON "public"."SitemapEntry"("group");

-- CreateIndex
CREATE INDEX "PageAudit_pageId_idx" ON "public"."PageAudit"("pageId");

-- CreateIndex
CREATE INDEX "PageAudit_kind_idx" ON "public"."PageAudit"("kind");

-- CreateIndex
CREATE INDEX "ContactInquiry_createdAt_idx" ON "public"."ContactInquiry"("createdAt");

-- AddForeignKey
ALTER TABLE "public"."Service" ADD CONSTRAINT "Service_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."ServiceCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Location" ADD CONSTRAINT "Location_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Area" ADD CONSTRAINT "Area_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "public"."Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Page" ADD CONSTRAINT "Page_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "public"."Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Page" ADD CONSTRAINT "Page_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "public"."Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Page" ADD CONSTRAINT "Page_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "public"."Area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Page" ADD CONSTRAINT "Page_propertyTypeId_fkey" FOREIGN KEY ("propertyTypeId") REFERENCES "public"."PropertyType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Page" ADD CONSTRAINT "Page_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "public"."Problem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Page" ADD CONSTRAINT "Page_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "public"."PublishingBatch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PageContent" ADD CONSTRAINT "PageContent_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "public"."Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BlogPost" ADD CONSTRAINT "BlogPost_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."BlogCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BlogPost" ADD CONSTRAINT "BlogPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."Author"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InternalLink" ADD CONSTRAINT "InternalLink_fromPageId_fkey" FOREIGN KEY ("fromPageId") REFERENCES "public"."Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InternalLink" ADD CONSTRAINT "InternalLink_toPageId_fkey" FOREIGN KEY ("toPageId") REFERENCES "public"."Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PageAudit" ADD CONSTRAINT "PageAudit_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "public"."Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;
