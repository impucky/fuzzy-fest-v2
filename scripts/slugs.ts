import clipboard from "clipboardy";

function toSlug(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  const text = await clipboard.read();
  const slugs = text.split(/\r?\n/).map(toSlug).filter(Boolean);
  await clipboard.write(JSON.stringify(slugs, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
