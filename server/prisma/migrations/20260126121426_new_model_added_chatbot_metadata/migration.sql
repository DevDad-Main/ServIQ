-- CreateTable
CREATE TABLE "ChatbotMetadata" (
    "id" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "colour" TEXT NOT NULL DEFAULT '#4f39f6',
    "welcomeMessage" TEXT NOT NULL DEFAULT 'Hello there, How can i help you today?',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatbotMetadata_pkey" PRIMARY KEY ("id")
);
