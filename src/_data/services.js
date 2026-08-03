import { readFileSync, readdirSync } from "node:fs";
import yaml from "js-yaml";

export default function () {
  const dir = "src/content/services";
  const files = readdirSync(dir).filter((f) => f.endsWith(".yml"));
  return files
    .map((file) => yaml.load(readFileSync(`${dir}/${file}`, "utf8")))
    .filter((service) => service.visible !== false)
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}
