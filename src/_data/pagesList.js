import { readFileSync, readdirSync } from "node:fs";
import yaml from "js-yaml";

export default function () {
  const dir = "src/content/pages";
  const files = readdirSync(dir).filter((f) => f.endsWith(".yml"));
  return files.map((file) => yaml.load(readFileSync(`${dir}/${file}`, "utf8")));
}
