import { type AsyncFunc, type Func } from "#src/utils";

import * as middlewares from "./middlewares";
import { getPackageJSON, git } from "./utils";

export default async function run(
  command:
    | "build"
    | "check"
    | "deploy"
    | "format"
    | "postpack"
    | "prepack"
    | "regenerate"
    | "start"
    | "test",
  ...commands: AsyncFunc[]
): Promise<void> {
  const list = new Array<Func | AsyncFunc>();

  try {
    const context = await createContext(command, list);
    await Promise.all(Object.values(middlewares).map((m) => m(context)));

    if (command === "start") await executeDeferred(list);
    for (const cmd of commands) await cmd();
  } catch (error: any) {
    if (error.ignorable !== true) console.error(error);
  } finally {
    if (command !== "start") await executeDeferred(list);
  }
}

async function createContext(
  command:
    | "build"
    | "check"
    | "deploy"
    | "format"
    | "postpack"
    | "prepack"
    | "regenerate"
    | "start"
    | "test",
  list: (Func | AsyncFunc)[],
): Promise<middlewares.MiddlewaresTypes.Context> {
  const packageJSON = await getPackageJSON();
  if (!packageJSON.core)
    throw new Error("'core' property is missing within the 'package.json'");

  const version = (await git.isInsideRepository())
    ? await git
        .getTags({ merged: true })
        .then((tags) => tags.at(-1))
        .then((tag) => git.getTagInfo(tag || "v0.0.0"))
        .then((info) => `${info.major}.${info.minor}.${info.patch}`)
    : "0.0.0";

  return {
    command,
    core: packageJSON.core,
    defer: (callback) => list.push(callback),
    version,
  };
}

async function executeDeferred(list: (Func | AsyncFunc)[]): Promise<void> {
  let promise = Promise.resolve();
  for (let i = list.length - 1; i >= 0; i--) promise = promise.then(list[i]);
  await promise;
}
