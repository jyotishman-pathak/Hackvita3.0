import { AisummarizeCommit } from "@/lib/ai/gemini";
import { saveAnalysisToDB } from "@/lib/db/saveAnalysis";
import { getCommitDiff } from "@/lib/github/github";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { commitHash, projectId } = await req.json();

  if (!commitHash || !projectId) {
    return NextResponse.json({ error: "Missing commitHash or projectId" }, { status: 400 });
  }

  try {
    const diff = await getCommitDiff(commitHash);
    if (!diff) return NextResponse.json({ error: "No diff found" }, { status: 404 });

    const analysis = await AisummarizeCommit(diff);
    const savedCommit = await saveAnalysisToDB(projectId, commitHash, analysis);

    return NextResponse.json(savedCommit);
  } catch (error: any) {
    return NextResponse.json({ error: "Analysis failed", details: error.message }, { status: 500 });
  }
}
