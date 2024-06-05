import readFile from "./readFile";

export default async function isLibrary(): Promise<boolean> {
  const packageJSON = JSON.parse(await readFile("package.json"));
  return packageJSON.private === undefined || packageJSON.private === false;
}
