-- CreateTable
CREATE TABLE "Member" (
    "id" SERIAL NOT NULL,
    "age" INTEGER NOT NULL DEFAULT 18,
    "name" VARCHAR(255) NOT NULL,
    "fakultas" VARCHAR(255) NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);
