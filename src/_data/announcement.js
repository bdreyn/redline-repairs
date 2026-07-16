import { readFileSync } from "node:fs";
import yaml from "js-yaml";

export default function () {
  return yaml.load(readFileSync("src/content/announcement.yml", "utf8"));
}
