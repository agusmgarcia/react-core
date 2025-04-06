# React Core

Set of opinionated commands, state manager and utilities for NextJS applications, libraries and Azure functions.

- [Commands](/.github/README.commands.md)
- [Store](/.github/README.store.md)
- [Utilities](/.github/README.utilities.md)

## Getting started

Create a _.npmrc_ file at the root of your project. This file should look like this:

```.npmrc
# ./.npmrc

@agusmgarcia:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

> Make sure to have exported an environment variable called `NODE_AUTH_TOKEN`. Its value should be your GitHub PAT.

Then execute the following command:

```bash
npm i @agusmgarcia/react-core
```
