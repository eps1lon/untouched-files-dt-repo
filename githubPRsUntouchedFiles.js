/**
 * usage:
 * 1. edit scripts/getPrAuthors and past a newline separated list of pr numbers
 * 2. $ GH_API_TOKEN=YOUR_TOKEN node scripts/getPrAuthors
 */
const { graphql } = require("@octokit/graphql");
const { promises: fs } = require("fs");
const path = require("path");

const token = process.env.GH_API_TOKEN;

run({ outputPath: path.resolve(process.argv[2]) }).catch(error => {
  console.error(error);
  process.exit(1);
});

async function run({ outputPath }) {
  let cursor = null;
  const files = [];
  do {
    const { next, files: partialFiles } = await getOpenPRFiles(cursor);
    files.push(...partialFiles);

    cursor = next;
  } while (cursor !== null);

  await fs.writeFile(outputPath, files.join(`\n`));
  console.log(`Files as '\\n' separated list written to ${outputPath}`);
}

async function getOpenPRFiles(cursor) {
  const {
    repository: { pullRequests }
  } = await graphql(
    `
      query untouchedFiles($cursor: String) {
        repository(owner: "DefinitelyTyped", name: "DefinitelyTyped") {
          pullRequests(states: OPEN, first: 100, after: $cursor) {
            edges {
              node {
                permalink
                files(first: 100) {
                  totalCount
                  nodes {
                    path
                  }
                }
              }
              cursor
            }
            totalCount
            pageInfo {
              endCursor
              hasNextPage
            }
          }
        }
      }
    `,
    {
      cursor,
      headers: {
        authorization: `token ${token}`
      }
    }
  );

  return {
    files: pullRequests.edges
      .map(pullRequest => {
        const {
          node: { files, permalink }
        } = pullRequest;

        if (files.totalCount >= 100) {
          console.warn(
            `${permalink} had more files than were allowed to fetch. You need to add them manually.`
          );
        }

        return files.nodes.map(file => {
          return file.path;
        });
      })
      .flat(),
    next:
      pullRequests.pageInfo.hasNextPage === true
        ? pullRequests.pageInfo.endCursor
        : null
  };
}
