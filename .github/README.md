# React Core

Set of opinionated commands to run, check, format and build react applications and libraries. It uses the following packages:

- Eslint
- NextJS
- Prettier
- Typescript
- Webpack

## Getting started

Create a _.npmrc_ file at the root of your project. This file should look like this:

```.npmrc
@agusmgarcia:registry=https://npm.pkg.github.com
```

Then execute the following command:

```bash
npm i @agusmgarcia/react-core --save-dev
```

## Detect project type

In order to determine whether the project is an app or a library, this package checks the `package.json.private` field. It is a library in case its value is `false` or `undefined`. Check the following snippet:

```typescript
export default async function isLibrary(): Promise<boolean> {
  const packageJSON = JSON.parse(await readFile("package.json"));
  return packageJSON.private === undefined || packageJSON.private === false;
}
```

## Available commands

In your `package.json` file, within the `scripts` section add the following commands based on whether it's an application or a library.

### Application

```jsonc
// package.json

{
  "scripts": {
    "build": "agusmgarcia-build",
    "check": "agusmgarcia-check",
    "format": "agusmgarcia-format",
    "start": "agusmgarcia-start"
  }
}
```

### Library

```jsonc
// package.json

{
  "scripts": {
    "check": "agusmgarcia-check",
    "format": "agusmgarcia-format",
    "postpack": "agusmgarcia-postpack",
    "prepack": "agusmgarcia-prepack"
  }
}
```

## Disable features

You can disable `eslint` by providing the `--no-eslint` option to the commands listed above. You can also disable `prettier`, `typescript` and `webpack` by following the same process.

> For example, in case you want to disable `eslint` for the check command, execute: `agusmgarcia-check --no-eslint`

## Force overwritting files

When you run each command for the first time, the corresponding files are created. Then, you are free to change it as your needs. In case you want the file be recreated by the library use the `--force` or `-f` flag.

> For example, `agusmgarcia-check -f`. It will recreate all the files.
