import "dotenv/config";

import mongoose from "mongoose";

import Confession from "../models/Confession.js";
import confessionData from "./confessionData.js";
// =========================================================
// DATABASE
// =========================================================

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

// =========================================================
// DATE RANGE
// =========================================================

const START_DATE = new Date("2026-03-01T12:00:00.000Z");

const END_DATE = new Date("2026-08-24T18:00:00.000Z");

// =========================================================
// DETERMINISTIC SHUFFLE
// =========================================================

const shuffle = (array) => {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor((Math.sin(i * 999) + 1) * 0.5 * (i + 1));

    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
};

// =========================================================
// RANDOM TIME BETWEEN TWO DATES
// =========================================================

const dateBetween = (start, end) => {
  const timestamp =
    start.getTime() + Math.random() * (end.getTime() - start.getTime());

  return new Date(timestamp);
};

// =========================================================
// SEED
// =========================================================

const seedConfessions = async () => {
  try {
    if (!MONGO_URI) {
      throw new Error(
        "MongoDB connection string is missing. Check MONGO_URI or MONGODB_URI in your .env file.",
      );
    }

    console.log("Connecting to MongoDB...");

    await mongoose.connect(MONGO_URI);

    console.log("MongoDB connected.");

    console.log(`Preparing ${confessionData.length} seed confessions...`);

    // -----------------------------------------------------
    // SHUFFLE CONTENT
    // -----------------------------------------------------

    const shuffledConfessions = shuffle(confessionData);

    // -----------------------------------------------------
    // BUILD RECORDS
    // -----------------------------------------------------

    const documents = shuffledConfessions.map((content, index) => {
      const createdAt = dateBetween(START_DATE, END_DATE);

      return {
        content,

        author: "Anonymous",

        isAnonymous: true,

        status: "approved",

        /*
         * Feature a portion of the launch
         * content so the Hall of Shame
         * isn't empty.
         */
        featured: index < 24,

        createdAt,

        updatedAt: createdAt,
      };
    });

    // -----------------------------------------------------
    // INSERT WITHOUT DUPLICATES
    // -----------------------------------------------------

    let inserted = 0;
    let skipped = 0;

    for (const document of documents) {
      const existing = await Confession.exists({
        content: document.content,
      });

      if (existing) {
        skipped++;

        continue;
      }

      await Confession.create(document);

      inserted++;
    }

    // -----------------------------------------------------
    // RESULT
    // -----------------------------------------------------

    console.log("");
    console.log("==========================================");
    console.log(" SnapConfused confession seed complete");
    console.log("==========================================");

    console.log(`Total seed content: ${confessionData.length}`);

    console.log(`Inserted: ${inserted}`);

    console.log(`Already existed: ${skipped}`);

    console.log(`Featured: ${Math.min(24, inserted)}`);

    console.log("Date range: March 1 → August 24, 2026");

    console.log("==========================================");
    console.log("");
  } catch (error) {
    console.error("Confession seed failed:");

    console.error(error);

    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();

    console.log("MongoDB connection closed.");
  }
};

// =========================================================
// RUN
// =========================================================

seedConfessions();
