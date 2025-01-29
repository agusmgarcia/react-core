import { EOL } from "os";

import execute from "./execute";

const tagRegexp = /^v([0-9]+)\.([0-9]+)\.([0-9]+)$/;

export default function getTags(): Promise<string[]> {
  return execute("git tag --merged", false)
    .then((tags) => tags?.split(EOL) ?? [])
    .then((tags) => tags.filter(filterTags))
    .then((tags) => tags.sort(sortTags));
}

function filterTags(tag: string): boolean {
  return tagRegexp.test(tag);
}

function sortTags(tag1: string, tag2: string): number {
  const tagInfo1 = tagRegexp.exec(tag1);
  const tagInfo2 = tagRegexp.exec(tag2);

  for (let i = 1; i < 4; i++) {
    const result = +tagInfo2![i] - +tagInfo1![i];
    if (result === 0) continue;
    return -result;
  }

  return 0;
}
