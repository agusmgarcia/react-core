import readline from "readline";

export default function question(message: string): Promise<string> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(`${message} `, (response) => {
      rl.close();
      resolve(response);
    });
  });
}
