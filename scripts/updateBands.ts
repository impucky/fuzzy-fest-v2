import fs from "fs";
import path from "path";

const festivalsDir = path.resolve("content/festivals");
const bandsPath = path.resolve("content/bands.json");

const bands: Record<string, string> = JSON.parse(fs.readFileSync(bandsPath, "utf-8"));
const newBands = new Set<string>();

function titleize(slug: string) {
  return slug
    .split("-")
    .map((term) => term.charAt(0).toUpperCase() + term.slice(1))
    .join(" ");
}

function getFestivalFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return getFestivalFiles(fullPath);
    if (entry.isFile() && entry.name.endsWith(".json")) return [fullPath];
    return [];
  });
}

const festivalFiles = getFestivalFiles(festivalsDir);

for (const file of festivalFiles) {
  const content = JSON.parse(fs.readFileSync(file, "utf-8"));
  if (Array.isArray(content.lineup)) {
    for (const slug of content.lineup) {
      if (!bands[slug]) {
        bands[slug] = titleize(slug);
        newBands.add(slug);
      }
    }
  }
}

const sorted = Object.fromEntries(Object.entries(bands).sort(([a], [b]) => a.localeCompare(b)));

fs.writeFileSync(bandsPath, JSON.stringify(sorted, null, 2), "utf-8");

if (newBands.size) {
  console.log("Added new bands :");
  console.log([...newBands].sort().join("\n"));
} else {
  console.log("No bands to add");
}
