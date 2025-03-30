import {Octokit} from "octokit"
import axios from "axios"
import { AisummarizeCommit } from "../ai/gemini"
export const octokit = new  Octokit({
    auth: process.env.GITHUB_TOKEN
})

const githubUrl = "https://github.com/oppia/oppia"


async function summariseCommit(githubUrl: string, commitHash : string){
    const {data} = await axios.get(`${githubUrl}/commit/${commitHash}.diff` , {
        headers : {
            Accept:'application/vnd.github.v3.diff'
        }
    })
    return await AisummarizeCommit(data)
}




type Response ={
    commitHash : string,
    commitMessage : string
    commitAuthorName : string,
    commitAuthorAvatar : string,
    commitDate : string
}

export const getCommitHashes = async ( githubUrl: string): Promise<Response[]>=>{
    const {data} =await octokit.rest.repos.listCommits({
        owner:'oppia',
        repo:'oppia'
    })
    const sortedCommits = data.sort((a:any, b:any)=> new Date(b.commit.author.date).getTime() - new Date(a.commit.author.date).getTime()) as any []

    return sortedCommits.slice(0,15).map((commit:any)=>({
        commitHash : commit.sha as string,
        commitMessage : commit.commit.message ?? "" ,
        commitAuthorAvatar : commit.author?.avatar_url ?? "",
        commitAuthorName : commit?.commit?.author?.name ?? " ",
        commitDate : commit?.commit.author.date ?? "",
    })) 
}

console.log(await getCommitHashes(githubUrl))



