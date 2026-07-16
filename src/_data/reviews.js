import { readFileSync, globSync } from "node:fs";
import yaml from "js-yaml";

export default function () {
  const files = globSync("src/content/reviews/*.yml");
  const approved = files
    .map((file) => yaml.load(readFileSync(file, "utf8")))
    .filter((review) => review.status === "approved")
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const count = approved.length;
  const average = count
    ? Math.round((approved.reduce((sum, r) => sum + r.rating, 0) / count) * 10) / 10
    : 0;

  return { items: approved.slice(0, 9), count, average, averageDisplay: average.toFixed(1) };
}
