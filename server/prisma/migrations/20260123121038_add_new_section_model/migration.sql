-- CreateTable
CREATE TABLE "section" (
    "id" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sourceIds" TEXT[],
    "tone" TEXT NOT NULL,
    "allowedTopics" TEXT[],
    "blockedTopics" TEXT[],
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "section_pkey" PRIMARY KEY ("id")
);
