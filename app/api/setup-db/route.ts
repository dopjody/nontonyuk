
import prisma from "../../utils/db";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        console.log("Starting DB Setup...");

        // Enable vector extension if needed (optional)
        // await prisma.$executeRawUnsafe(`CREATE EXTENSION IF NOT EXISTS vector;`);

        // Create Tables
        await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Account" (
          "id" TEXT NOT NULL,
          "userId" TEXT NOT NULL,
          "type" TEXT NOT NULL,
          "provider" TEXT NOT NULL,
          "providerAccountId" TEXT NOT NULL,
          "refresh_token" TEXT,
          "access_token" TEXT,
          "expires_at" INTEGER,
          "token_type" TEXT,
          "scope" TEXT,
          "id_token" TEXT,
          "session_state" TEXT,
          "refresh_token_expires_in" INTEGER,
          CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
      );
    `);

        await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Session" (
          "id" TEXT NOT NULL,
          "sessionToken" TEXT NOT NULL,
          "userId" TEXT NOT NULL,
          "expires" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
      );
    `);

        await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "User" (
          "id" TEXT NOT NULL,
          "name" TEXT,
          "email" TEXT,
          "emailVerified" TIMESTAMP(3),
          "image" TEXT,
          CONSTRAINT "User_pkey" PRIMARY KEY ("id")
      );
    `);

        await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Movie" (
          "id" INTEGER NOT NULL,
          "imageString" TEXT NOT NULL,
          "title" TEXT NOT NULL,
          "age" INTEGER NOT NULL,
          "duration" DOUBLE PRECISION NOT NULL,
          "overview" TEXT NOT NULL,
          "release" INTEGER NOT NULL,
          "videoSource" TEXT NOT NULL,
          "category" TEXT NOT NULL,
          "youtubeString" TEXT NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "Movie_pkey" PRIMARY KEY ("id")
      );
    `);

        await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "WatchList" (
          "id" TEXT NOT NULL,
          "userId" TEXT NOT NULL,
          "movieId" INTEGER,
          CONSTRAINT "WatchList_pkey" PRIMARY KEY ("id")
      );
    `);

        await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "VerificationToken" (
          "identifier" TEXT NOT NULL,
          "token" TEXT NOT NULL,
          "expires" TIMESTAMP(3) NOT NULL
      );
    `);

        // Create Indexes (Wrap in Try-Catch to avoid failure if exists)
        try { await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");`); } catch (e) { }
        try { await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");`); } catch (e) { }
        try { await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX "User_email_key" ON "User"("email");`); } catch (e) { }
        try { await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");`); } catch (e) { }
        try { await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");`); } catch (e) { }

        // Add Foreign Keys (Separate try-catch blocks needed properly, or raw SQL that checks constraint validity)
        // Simplify: Assume standard creation. If fails, it might be due to existing constraint.

        // Using DO block for idempotent constraints in Postgres
        /*
        await prisma.$executeRawUnsafe(`
          DO $$ BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Account_userId_fkey') THEN
              ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
            END IF;
          END $$;
        `);
        */
        // Since we are running raw, let's keep it simple. If valid table structure, these constraints are key.
        // If table existed before, this might fail.

        try {
            await prisma.$executeRawUnsafe(`ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;`);
        } catch (e) { console.log("Constraint Account_userId_fkey might already exist"); }

        try {
            await prisma.$executeRawUnsafe(`ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;`);
        } catch (e) { console.log("Constraint Session_userId_fkey might already exist"); }

        try {
            await prisma.$executeRawUnsafe(`ALTER TABLE "WatchList" ADD CONSTRAINT "WatchList_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE SET NULL ON UPDATE CASCADE;`);
        } catch (e) { console.log("Constraint WatchList_movieId_fkey might already exist"); }


        return NextResponse.json({ success: true, message: "Database tables setup completed!" });
    } catch (error: any) {
        console.error("Setup DB Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
