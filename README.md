# chmod.js [![license][license-image]][license-url] [![npm][npm-image]][npm-url]

[![coverage][nyc-cov-image]][github-url] [![dependency][depencency-image]][dependency-url] [![maintenance][maintenance-image]][npmsio-url] [![quality][quality-image]][npmsio-url] [![github][github-test-image]][github-test-url] [![travis][travis-image]][travis-url]

`@kei-g/chmod` - CLI for changing file permissions works on [Node.js](https://nodejs.org/)

## Installation

To build for your package,

```shell
npm i @kei-g/chmod --save-dev
```

and configure the package.json; for example, `chmod` after transpile by `tsc`

```json
{
  "scripts": {
    "build": "tsc",
    "postbuild": "chmod +x dist/bin/your-script.js",
  }
}
```

## Lincense

The scripts and documentation in this project are released under the [BSD-3-Clause License](https://github.com/kei-g/chmod.js/blob/main/LICENSE)

## Contributions

Contributions are welcome! See [Contributor's Guide](https://github.com/kei-g/chmod.js/blob/main/CONTRIBUTING.md)

### Code of Conduct

:clap: Be nice. See [our code of conduct](https://github.com/kei-g/chmod.js/blob/main/CODE_OF_CONDUCT.md)

[depencency-image]:https://img.shields.io/librariesio/release/npm/@kei-g/chmod?logo=nodedotjs
[dependency-url]:https://npmjs.com/package/@kei-g/chmod?activeTab=dependencies
[github-test-image]:https://github.com/kei-g/chmod.js/actions/workflows/main.yml/badge.svg?branch=main
[github-test-url]:https://github.com/kei-g/chmod.js/actions/workflows/main.yml
[github-url]:https://github.com/kei-g/chmod.js
[license-image]:https://img.shields.io/github/license/kei-g/chmod.js
[license-url]:https://opensource.org/licenses/BSD-3-Clause
[maintenance-image]:https://img.shields.io/npms-io/maintenance-score/@kei-g/chmod?logo=npm
[npm-image]:https://img.shields.io/npm/v/@kei-g/chmod.svg?logo=npm
[npm-url]:https://npmjs.org/package/@kei-g/chmod
[npmsio-url]:https://npms.io/search?q=%40kei-g%2Fchmod
[nyc-cov-image]:https://img.shields.io/nycrc/kei-g/chmod.js?config=.nycrc.json&label=coverage&logo=mocha
[quality-image]:https://img.shields.io/npms-io/quality-score/@kei-g/chmod?logo=npm
[travis-image]:https://img.shields.io/travis/com/kei-g/chmod.js/main?label=build%20%26%20test&logo=travis
[travis-url]:https://app.travis-ci.com/kei-g/chmod.js
