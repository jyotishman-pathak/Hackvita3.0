import { Octokit } from "octokit";

export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

type Response = {
  commitHash: string;
  commitMessage: string;
  commitAuthorName: string;
  commitAuthorAvatar: string;
  commitDate: string;
};

export const getCommitHashes = async (): Promise<Response[]> => {
  const { data } = await octokit.rest.repos.listCommits({
    owner: "oppia",
    repo: "oppia",
  });

  const sortedCommits = data.sort(
    (a: any, b: any) =>
      new Date(b.commit.author.date).getTime() -
      new Date(a.commit.author.date).getTime()
  );

  return sortedCommits.slice(0, 15).map((commit: any) => ({
    commitHash: commit.sha as string,
    commitMessage: commit.commit.message ?? "",
    commitAuthorAvatar: commit.author?.avatar_url ?? "",
    commitAuthorName: commit?.commit?.author?.name ?? " ",
    commitDate: commit?.commit.author.date ?? "",
  }));
};

export const getCommitDiff = async (commitHash: string): Promise<string> => {
  const { data } = await octokit.request(
    `GET /repos/oppia/oppia/commits/${commitHash}`
  );

  return data.files?.map((file: any) => file.patch).join("\n") ?? "";
};
