import { readFileSync, globSync } from "node:fs";
import yaml from "js-yaml";

export default function () {
  const files = globSync("src/content/services/*.yml");
  return files
    .map((file) => yaml.load(readFileSync(file, "utf8")))
    .filter((service) => service.visible !== false)
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}
