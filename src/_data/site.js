import { readFileSync } from "node:fs";
import yaml from "js-yaml";

export default function () {
  return yaml.load(readFileSync("src/content/site.yml", "utf8"));
}
