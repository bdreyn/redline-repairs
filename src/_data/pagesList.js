import { readFileSync, globSync } from "node:fs";
import yaml from "js-yaml";

export default function () {
  const files = globSync("src/content/pages/*.yml");
  return files.map((file) => yaml.load(readFileSync(file, "utf8")));
}
