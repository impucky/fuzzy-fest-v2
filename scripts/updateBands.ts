import fs from "fs";
import path from "path";

const festivalsDir = path.resolve("src/_content/festivals");
const bandsFile = path.resolve("src/_content/bands.json");

const bandsData: { slug: string; name: string }[] = JSON.parse(fs.readFileSync(bandsFile, "utf-8"));
const existingSlugs = new Set(bandsData.map((b) => b.slug));

const festivalFiles = fs
  .readdirSync(festivalsDir, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => path.join(festivalsDir, dirent.name));

const newBands: { slug: string; name: string }[] = [];

for (const festivalFolder of festivalFiles) {
  const jsonFiles = fs.readdirSync(festivalFolder).filter((f) => f.endsWith(".json"));
  for (const jsonFile of jsonFiles) {
    const festival = JSON.parse(fs.readFileSync(path.join(festivalFolder, jsonFile), "utf-8"));
    if (festival.lineup?.length) {
      for (const slug of festival.lineup) {
        if (!existingSlugs.has(slug)) {
          const name = slug
            .split("-")
            .map((term: string) => term.charAt(0).toUpperCase() + term.slice(1))
            .join(" ");
          newBands.push({ slug, name });
          existingSlugs.add(slug);
        }
      }
    }
  }
}

if (newBands.length === 0) {
  console.log("No bands to add");
  process.exit(0);
}

const mergedBands = [...bandsData, ...newBands].sort((a, b) => a.name.localeCompare(b.name));
fs.writeFileSync(bandsFile, JSON.stringify(mergedBands, null, 2), "utf-8");

console.log("Updated bands:");
newBands.forEach((b) => console.log(`- ${b.name}`));
