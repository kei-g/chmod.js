# Change Logs

## Version 1.0.12

- :green_heart: CI
  - An external action is now used to create a release on GitHub
  - Events that occur during branch creation are now ignored to avoid executing 'Release' workflow
  - Node.js version 20.x is added for CI
  - The 'github' job on 'Release' workflow now fails if github.ref is inappropriate
  - The latest Node.js is now used to publish the package
  - The workflow to automatically merge PRs from Dependabot[bot] is added
- :arrow_up: Packages for development are bumped
  - `@types/chai` is bumped from 4.3.4 to 4.3.5
  - `@types/node` is bumped from 18.11.18 to 20.1.3
  - `@typescript-eslint/eslint-plugin` is bumped from 5.48.2 to 5.59.5
  - `@typescript-eslint/parser` is bumped from 5.48.2 to 5.59.5
  - `esbuild` is bumped from 0.17.4 to 0.17.18
  - `eslint` is bumped from 8.32.0 to 8.40.0
  - `libfsasync` is bumped from 1.0.14 to 1.0.16
  - `rimraf` is bumped from 4.1.1 to 5.0.0
  - `typescript` is bumped from 4.9.4 to 5.0.4

## Version 1.0.11

- :arrow_up: Packages for development are bumped
  - `@typescript-eslint/eslint-plugin` is bumped from 5.48.1 to 5.48.2
  - `@typescript-eslint/parser` is bumped from 5.48.1 to 5.48.2
  - `esbuild` is bumped from 0.17.0 to 0.17.4
  - `libfsasync` is bumped from 1.0.12 to 1.0.14
  - `rimraf` is bumped from 4.0.5 to 4.1.1

## Version 1.0.10

- :arrow_up: Packages for development are bumped
  - `esbuild` is bumped from 0.16.16 to 0.17.0
  - `eslint` is bumped from 8.31.0 to 8.32.0
  - `libfsasync` is bumped from 1.0.10 to 1.0.12
  - `rimraf` is bumped from 3.0.2 to 4.0.5

## Version 1.0.9

- :arrow_up: Packages for development are bumped
  - `@types/node` is bumped from 18.11.17 to 18.11.18
  - `@typescript-eslint/eslint-plugin` is bumped from 5.47.0 to 5.48.1
  - `@typescript-eslint/parser` is bumped from 5.47.0 to 5.48.1
  - `esbuild` is bumped from 0.16.10 to 0.16.16
  - `eslint` is bumped from 8.30.0 to 8.31.0
  - `libfsasync` is bumped from 1.0.8 to 1.0.10
- :lock: Security update
  - `json5` is bumped from 2.2.0 to 2.2.3

## Version 1.0.8

- :green_heart: CI chore
  - `actions/checkout` is bumped from 2 to 3
  - `actions/setup-node` is bumped from 2 to 3
  - `actions/upload-artifact` is bumped from 2 to 3
  - CodeQL is installed
  - GitHub actions package ecosystem is added on Dependabot
  - Job to get the commit summary to create release is fixed
  - Job to publish the package is added
  - npm is made to be cached on setup Node.js
- :arrow_up: Packages for development are bumped
  - `@types/chai` is bumped from 4.3.0 to 4.3.4
  - `@types/mocha` is bumped from 9.0.0 to 10.0.1
  - `@types/node` is bumped from 16.11.12 to 18.11.17
  - `@typescript-eslint/eslint-plugin` is bumped from 5.6.0 to 5.47.0
  - `@typescript-eslint/parser` is bumped from 5.6.0 to 5.47.0
  - `chai` is bumped from 4.3.4 to 4.3.7
  - `esbuild` is bumped from 0.14.2 to 0.16.10
  - `eslint` is bumped from 8.4.1 to 8.30.0
  - `libfsasync` is bumped from 1.0.6 to 1.0.8
  - `mocha` is bumped from 9.1.3 to 10.2.0
  - `ts-node` is bumped from 10.4.0 to 10.9.1
  - `typescript` is bumped from 4.5.3 to 4.9.4

## Version 1.0.7

- :technologist: Auto release on create tag event
- :hammer: Build script is improved
- :memo: GitHub Actions' canonical badge is used instead of Shields.io
- :arrow_up: Packages for development are bumped
  - `@types/chai` is bumped from 4.2.22 to 4.3.0
  - `@types/node` is bumped from 16.11.11 to 16.11.12
  - `@typescript-eslint/eslint-plugin` is bumped from 5.5.0 to 5.6.0
  - `@typescript-eslint/parser` is bumped from 5.5.0 to 5.6.0
  - `eslint` is bumped from 8.4.0 to 8.4.1
  - `libfsasync` is bumped from 1.0.5 to 1.0.6
  - `typescript` is bumped from 4.5.2 to 4.5.3
- :memo: README.md is updated
  - contribution section is added
  - license section is added
- :pencil2: Typo is fixed
- :green_heart: Use cache on GitHub CI

## Version 1.0.6

- :memo: CONTRIBUTING.md is added
- :robot: Dependabot is installed
- :loud_sound: Description are added to assertion
- :green_heart: Node.js versions are added for CI
  - 12.x to GitHub CI and Travis CI
  - 16.x to Travis CI
- :arrow_up: Packages are bumped
  - `libfsasync` is bumped from 1.0.1 to 1.0.5
  - `@types/node` is bumped from 16.11.7 to 16.11.11
  - `@typescript-eslint/eslint-plugin` is bumped from 5.3.1 to 5.5.0
  - `@typescript-eslint/parser` is bumped from 5.3.1 to 5.5.0
  - `esbuild` is bumped from 0.13.13 to 0.14.2
  - `eslint` is bumped from 8.2.0 to 8.4.0
  - `typescript` is bumped from 4.4.4 to 4.5.2
- :package: URL of repository is simplified

## Version 1.0.5

- :arrow_up: Packages for development are updated
  - `@types/node` is upgraded from 16.11.6 to 16.11.7
  - `@typescript-eslint/eslint-plugin` is upgraded from 5.3.0 to 5.3.1
  - `@typescript-eslint/parser` is upgraded from 5.3.0 to 5.3.1
  - `esbuild` is upgraded from 0.13.12 to 0.13.13

## Version 1.0.4

- :arrow_up: Packages for development are updated
  - `@types/node` is upgraded from 16.11.1 to 16.11.6
  - `@typescript-eslint/eslint-plugin` is upgraded from 5.1.0 to 5.3.0
  - `@typescript-eslint/parser` is upgraded from 5.1.0 to 5.3.0
  - `esbuild` is upgraded from 0.13.8 to 0.13.12
  - `eslint` is upgraded from 8.0.1 to 8.2.0
  - `ts-node` is upgraded from 10.3.0 to 10.4.0

## Version 1.0.3

- :arrow_up: Packages for development are updated
  - `@types/chai` is upgraded from 4.2.21 to 4.2.22
  - `@types/node` is upgraded from 16.9.1 to 16.11.1
  - `@typescript-eslint/eslint-plugin` is upgraded from 4.31.0 to 5.1.0
  - `@typescript-eslint/parser` is upgraded from 4.31.0 to 5.1.0
  - `esbuild` is upgraded from 0.12.26 to 0.13.8
  - `eslint` is upgraded from 7.32.0 to 8.0.1
  - `mocha` is upgraded from 9.1.1 to 9.1.3
  - `ts-node` is upgraded from 10.2.1 to 10.3.0
  - `typescript` is upgraded from 4.4.2 to 4.4.4

## Version 1.0.2

- :building_construction: Build system is changed to `esbuild`
- :heavy_minus_sign: Dependent packages are removed
  - `mkdirp` is removed
  - `terser` is removed
- :sparkles: Newly supported platforms
  - ES2015 :new:
  - Node.js v14.x :new:
- :arrow_up: Packages for development are updated
  - `@types/node` is upgraded from 16.7.13 to 16.9.1
- :white_check_mark: Test suites are enhanced

## Version 1.0.1

- :speak_no_evil: .gitattributes is added
- :memo: Dependency badge's URL is correected

## Version 1.0.0

- :tada: Initial release
