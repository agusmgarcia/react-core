import { type Func } from "../../utilities";
import { upsertFile } from "../utilities";

export default async function nodeMiddleware(
  next: Func<[Promise<void>]>,
  regenerate: boolean,
  ignore: string[],
): Promise<void> {
  await upsertFile(".nvmrc", nvmrc, regenerate && !ignore.includes(".nvmrc"));
  await next();
}

const nvmrc = "20";
