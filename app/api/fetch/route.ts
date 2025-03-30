import { prisma } from "@/lib/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const commitHash = searchParams.get("commitHash");

  if (!commitHash) {
    return NextResponse.json({ error: "Missing commitHash" }, { status: 400 });
  }

  const commit = await prisma.commit.findUnique({
    where: { commitHash },
  });

  if (!commit) {
    return NextResponse.json({ error: "Commit not found" }, { status: 404 });
  }

  return NextResponse.json(commit.analysisJson);
}
