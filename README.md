# template

This is the main repository for template development. It provides the development environment (including scripts, configs, etc.) for template projects and includes the issue tracker and Kanban board.

Inside this repository, you can find all projects related to template. Each project is added under the `packages` directory and can be cloned all at once or selectively depending on your needs (see [installation instructions](#setting-up-the-environment) below).

## Table of Contents

- [Projects](#projects)
- [Setting up the Environment](#setting-up-the-environment)
  - [Production Stack](#production-stack)
  - [Cross-platform Flutter Project](#cross-platform-flutter-project)
- [Contributing to a Project](#contributing-to-a-project)
- [Deployment to Google Cloud](#deployment-to-google-cloud)
- [Environment Structure](#environment-structure)
  - [Configuration Files](#configuration-files)
  - [Scripts](#scripts)

## Projects

For detailed description of each project, see the README in their corresponding package directories.

- [@dwms/web](packages/web#readme)

  Client-side React web application for template to be used by the end user in the browser.

- [@dwms/content-server](packages/content-server#readme)

  Server-side application responsible for providing content for other services and performing actions on data in the database.

- [@dwms/common](packages/common#readme)

  Common code and types used by several different template projects.

## Setting Up the Environment

### Production Stack

If you are working on the service stack used in production (website with content server), follow these instructions:

1. Install [Node.js 20.9.0](https://nodejs.org/en/blog/release/v20.9.0)
1. Install [Yarn Classic](https://classic.yarnpkg.com/en/docs/install#windows-stable)
1. It's highly recommended to install [Visual Studio Code](https://code.visualstudio.com/), although you might be able to work with other code editors too
1. It's recommended to install the following extensions for Visual Studio Code (or their alternatives in other editors): `dbaeumer.vscode-eslint`, `esbenp.prettier-vscode`, `amatiasq.sort-imports`, `graphql.vscode-graphql`, `styled-components.vscode-styled-components`, `shd101wyy.markdown-preview-enhanced`, `davidanson.vscode-markdownlint`, `visualstudioexptteam.vscodeintellicode`, `coenraads.bracket-pair-colorizer`, `akamud.vscode-javascript-snippet-pack`, `dsznajder.es7-react-js-snippets`
1. Open the cloned directory inside Visual Studio Code by clicking File > "Open Folder..." or by right clicking on the folder in Windows Explorer and clicking "Open with Code"
1. Optionally, set up a key shortcut for fixing ESLint errors.
   Select File > Preferences > "Keyboard Shortcuts" and search for executeAutoFix to set a keyboard shortcut for the linting (e.g. `CTRL+E D`).
1. Open the integrated terminal by pressing ``Ctrl + ` `` or by clicking View > Terminal
1. Run `yarn install` to install the dependencies
1. Ask for Google Cloud access and once you've got it and run the following commands to be able to use Google Storage in your test environment:

   ```bash
   gcloud auth login
   gcloud config set project dwms-403519
   gcloud auth application-default login
   gcloud auth application-default set-quota-project dwms-403519
   ```

1. See [individual project setup instructions](#projects) on how to set them up for development

### Cross-platform Flutter Project

These instructions are for setting up the experimental `@dwms/app` for development.

1. Install [Flutter](https://flutter.dev/docs/get-started/install)
1. [Set up Flutter development](https://flutter.dev/docs/get-started/editor) with the editor of your choice
1. Run `flutter doctor -v` to check your setup
1. After cloning the repository, open and edit the project
1. If you are using an Android emulator or physical device, you need to run `adb reverse tcp:8080 tcp:8080` to forward the port of the local server.
1. On some emulators the session doesn't load. For now it's advised to use an emulator with API 30 (Android 11) if you have this problem.
1. Use run to debug the application or use `flutter run --release` to compile and test a production-ready build

_Note: As some dependencies (e.g. Dio) doesn't support the web platform yet, you will need to use an emulator or a physical Android or iOS device to contribute to this project._

## Contributing to a Project

See detailed instructions in the READMEs of the [corresponding projects](#projects).

General rules and best practices:

- Do **NOT** commit to the `main` branch. Find a branch that relates closely to your changes, or if no such branch exists, create a new one. Once you tested that the changes work, make a **pull request** to `develop`.
- Do **NOT** merge into `main` without having at least **2 people reviewed and accepted** your change. First, create a merge request, then wait for others to check it before merging.
- Do **NOT** deploy anything to production without permission from a lead developer
- **Always lint** your code before making a commit and make sure no errors remain. If an error is not fixable (automatically or manually), make a note in the documentation or put a comment in the code and ignore the least number of rules for the least number of lines that makes sense in that particular case.
- A new feature is **NOT** finished until it has at least **70%** test coverage on it
- Prefer **integration tests over unit tests**
- A new feature is **NOT** finished until it has an entry in the project wiki describing what it is, how it works and other notable facts and trickier parts of code explained (see past wiki entries for examples)
- A bug in code already merged into master is **NOT** the responsibility of the developer, who wrote the code. If you find one, please add it to the issues to be taken on by anyone, who has the capacity for it.
- Do **NOT** increase the setup time or complexity of a project. If a component needs additional setup, think twice before using it and/or make sure it is automated.
- Put any code that is used by multiple projects into `@dwms/common`. Try to **minimize code duplication**.
- Try to **limit comment length** in the code to keep it clean and readable. If a long note is required, please add it to the wiki instead and put a reference to it in the comments.
- Do **NOT** edit files generated by scripts. If changes are needed to be made, modify the script or create an additional file manually.

If you think you have a best practice to be added to this list or you would change some these, don't hesitate to discuss it with the team.

## Deployment to Google Cloud

Before deploying, please run `yarn lint` to make sure the code is linted properly and run all tests with `yarn test` and **make sure every one of them succeeds**. To deploy to production you will need access to the Google Cloud project; ask the lead developers for this.

1. Install and set up [Google Cloud SDK](https://cloud.google.com/sdk/docs/quickstarts)
1. You can edit `app.yaml`/`content-server.yaml` to edit the app configurations, `cloudbuild.yaml` (in each package's directory) to edit the build process and `dispatch.yaml` to edit the dispatch rules for the services (although everything should be set up already and they are usually don't need to be changed)
1. Change into the project directory and run `gcloud app deploy` to deploy to the Google Cloud servers
1. Once you deployed the required services, traffic can be redirected to the new versions by going to the [App Engine Versions](https://console.cloud.google.com/appengine/versions?serviceId=content-server&project=prepaired-273317) page on Google Cloud Dashborad, selecting the appropriate service from the dropdown and choosing "Migrate Traffic" (in case of `web`) and "Split Traffic" (in case of `content-server`; make sure you slide the traffic split over to 100%).

_Note:_ You can run `gcloud app deploy:promote` to automatically redirect the traffic to the new instances once they are deployed. Use this **ONLY if there are no changes** in the other service (e.g. no changes in `web` when deploying `content-server` and vice versa). Otherwise there might be errors while the other service is not updated yet.

To change the dispatch rules, run `gcloud app deploy dispatch.yaml`

## Environment Structure

In addition to the projects (already mentioned above) and editor configurations, this project contains the following noteworthy files:

### Configuration files

- `.eslintrc` - The main ESLint configuration, which is used by all TypeScript and JavaScript projects. It's important that you open the development environment, and not the individual projects, for editing, so that this config can be discovered by ESLint.
- `.gitignore` - A GitIgnore file for the repository. In addition to this, each project includes its own configuration file.
- `package.json` - Contains development dependencies (e.g. ESLint plugins) and the declaration of projects within the workspace (used by Yarn to intelligently install dependencies)
- `yarn.lock` - Automatically generated file for locking the exact version of all the dependencies (and their dependencies) within the workspace to be able to use the same version across developers' environments and also in production, minimizing the differences between setups and the errors resulting from them

### Scripts

- `upgrade.js` - ~~Used to upgrade all the dependencies of a project to their latest version ignoring their version specifier in the `package.json` file. To use it, change into the project directory and run the script using Node (e.g. `node ../upgrade.js`). You can also exclude dependencies from the upgrade by adding them to the `ignoredDependencies` array at the beginning of the upgrade script.~~
  Prefer `yarn upgrade-interactive [--latest]` to upgrade project dependencies instead. **Always test if the upgrade broke something** and if it did, fix it before making a commit.
