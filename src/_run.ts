type Input = Record<
  "core" | "eslint" | "github" | "prettier" | "typescript" | "webpack",
  (_force: boolean) => Promise<void>
>;

export default async function run(input: Input): Promise<void> {
  const commands = Object.keys(input)
    .filter((key) => key === "core" || !process.argv.includes(`--no-${key}`))
    .map((key) => input[key as keyof Input]);

  const force = process.argv.includes("-f") || process.argv.includes("--force");

  try {
    for (const cmd of commands) await cmd(force);
  } catch (error: any) {
    if (error.ignorable !== true) console.error(error);
  }
}
