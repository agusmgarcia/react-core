type Input = Record<
  "core" | "eslint" | "github" | "prettier" | "typescript" | "webpack",
  // eslint-disable-next-line unused-imports/no-unused-vars
  (options: { skip: string[] }) => Promise<void>
>;

export default async function run(input: Input): Promise<void> {
  const commands = Object.keys(input)
    .filter((key) => key === "core" || !process.argv.includes(`--no-${key}`))
    .map((key) => input[key as keyof Input]);

  const skip = process.argv
    .filter((flag) => flag.startsWith("--skip="))
    .map((skips) => skips.replace("--skip=", "").replace(/\s/g, ""))
    .flatMap((skips) => skips.split(","));

  const options = { skip };

  try {
    for (const cmd of commands) await cmd(options);
  } catch (error: any) {
    if (error.ignorable !== true) console.error(error);
  }
}
