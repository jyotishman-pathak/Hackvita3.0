import {Octokit} from "octokit"
export const octokit = new  Octokit({
    auth: process.env.GITHUB_TOKEN
})

const githubUrl = "https://github.com/oppia/oppia"


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