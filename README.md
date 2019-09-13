# untouched-files-dt-repo

Writes all the files currently touched by open PRs to DefinitelyTyped/DefinitelyTyped
into the specified file.

## Usage

```bash
$ git clone https://github.com/eps1lon/untouched-files-dt-repo.git
# If you're using yarn@^1.17.3 you don't need any install step. Otherwise run `npm install`
$ nvm use # or make sure node@^12.10 is installed
# have an existing GitHub API token or create a new one: https://github.com/settings/tokens/new
$ GH_API_TOKEN=YOUR_TOKEN_HERE yarn start YOUR_PRETTIER_IGNORE_PATH_HERE
# then run prettier on all the files you wish to format
# You won't create any merge conflicts. Only PRs from outdated base branches
# will be created with merge conflicts
```

## Contributing

This repository is only intended to help migrate the DT repository to prettier.
PRs that extend usage of this script beyond this purpose will not be accepted.
