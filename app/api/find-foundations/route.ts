import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import { Pinecone } from "@pinecone-database/pinecone";
import { MongoClient } from "mongodb";
import { Foundation } from "@/types";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY as string,
});
const mongoClient = new MongoClient(process.env.MONGODB_URI as string);

export async function POST(req: Request) {
  const { foundationPurpose } = await req.json();
  const startTime = Date.now();
  console.log(
    `[${new Date().toISOString()}] Received request for foundation purpose: ${foundationPurpose}`
  );

  try {
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: foundationPurpose,
      encoding_format: "float",
    });
    const embedding = embeddingResponse.data[0].embedding;

    const index = pinecone.Index("foundations-de-index");
    const indexStats = await index.describeIndexStats();
    const totalVectors = indexStats.totalRecordCount;

    const queryResponse = await index
      .namespace("main")
      .query({ vector: embedding, topK: 300 });

    await mongoClient.connect();
    const db = mongoClient.db("henophilia");
    const foundationsCollection = db.collection("foundations-de");
    const foundationIds = queryResponse.matches.map((match) => match.id);
    const foundations = await foundationsCollection
      .find({ internalId: { $in: foundationIds } })
      .toArray();

    const foundationsByInternalId = new Map<string, Foundation>();
    foundations.forEach((f) => {
      foundationsByInternalId.set(f.internalId, f as unknown as Foundation);
    });

    const endTime = Date.now();
    const executionTime = (endTime - startTime) / 1000; // Convert to seconds
    console.log(
      `[${new Date().toISOString()}] Request processed in ${executionTime} seconds`
    );

    return NextResponse.json({
      foundations: queryResponse.matches.map(({ id, score }) => ({
        ...foundationsByInternalId.get(id),
        score,
      })),
      executionTime,
      totalVectors,
    });
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] Error processing request:`,
      error
    );
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  } finally {
    await mongoClient.close();
  }
}
