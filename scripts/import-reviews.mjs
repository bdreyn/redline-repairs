import { existsSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import yaml from "js-yaml";

const apiKey = process.env.GOOGLE_PLACES_API_KEY;
const placeId = process.env.GOOGLE_PLACE_ID;

if (!apiKey || !placeId) {
  console.error("Missing GOOGLE_PLACES_API_KEY or GOOGLE_PLACE_ID env var.");
  process.exit(1);
}

const REVIEWS_DIR = "src/content/reviews";

async function main() {
  const res = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
    headers: {
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": "id,displayName,reviews",
    },
  });

  if (!res.ok) {
    throw new Error(`Places API request failed: ${res.status} ${await res.text()}`);
  }

  const place = await res.json();
  const reviews = place.reviews || [];

  let created = 0;
  for (const review of reviews) {
    const author = review.authorAttribution?.displayName || "Anonymous";
    const publishTime = review.publishTime || new Date().toISOString();
    const id = createHash("sha1").update(`${author}|${publishTime}`).digest("hex").slice(0, 10);
    const filePath = `${REVIEWS_DIR}/google-${id}.yml`;

    if (existsSync(filePath)) {
      continue; // never overwrite an existing (possibly moderated) entry
    }

    const entry = {
      author,
      rating: review.rating || 5,
      date: publishTime,
      text: review.text?.text || review.originalText?.text || "",
      avatar: review.authorAttribution?.photoUri || "",
      source: "google",
      status: "pending",
      review_url: review.googleMapsUri || "",
    };

    writeFileSync(filePath, yaml.dump(entry), "utf8");
    created += 1;
    console.log(`Created ${filePath}`);
  }

  console.log(`Done. ${created} new pending review(s) out of ${reviews.length} fetched.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
