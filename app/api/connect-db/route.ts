import { prisma } from "@/lib/db/prisma"
import { NextRequest } from "next/server"


export const POST = async (req: NextRequest) => {
    const body = await req.json();
    const { repoUrl, projectName, githubToken } = body;

    const data = await prisma.project.create({
        data:{
            githubUrl:repoUrl,
        name: projectName,

        }

        
    })
    return new Response(JSON.stringify(data), { status: 201 });
}