export function get(argName: string): string[] {
  const result = new Array<string>();

  for (let i = 0; i < process.argv.length; i++) {
    const arg = process.argv[i];
    if (!arg.startsWith(`--${argName}=`)) continue;
    result.push(arg.replace(`--${argName}=`, ""));
  }

  return result;
}

export function has(argName: string): boolean {
  return process.argv.some((a) => a === `--${argName}`);
}
