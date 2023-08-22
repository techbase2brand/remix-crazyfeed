-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shop" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "scope" TEXT,
    "expires" DATETIME,
    "accessToken" TEXT NOT NULL,
    "userId" BIGINT
);

-- CreateTable
CREATE TABLE "InstaFeed" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "instaUsername" TEXT NOT NULL,
    "instaTitle" TEXT NOT NULL,
    "instaSelectItems" TEXT NOT NULL,
    "instaSelectPosts" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "instCheckedImageIds" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
