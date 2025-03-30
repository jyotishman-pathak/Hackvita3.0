import { prisma } from "./prisma";

export const saveAnalysisToDB = async (projectId: string, commitHash: string, analysis: any) => {
  try {
    return await prisma.commit.upsert({
      where: { commitHash },
      update: { analysisJson: analysis },
      create: { projectId, commitHash, analysisJson: analysis },
    });
  } catch (error) {
    console.error("Database save failed:", error);
    throw new Error("Database save failed");
  }
};