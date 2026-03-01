# Fuzzy Fest v2
Map of heavy music festivals using Astro + React + Maplibre

#### Run locally :
- Clone the repo
- Install dependencies with `pnpm i`
- Run the dev server with `pnpm dev`

#### Contributing :
- I might add some basic CMS in the future, but for now the content is managed manually
- Festivals each have a folder in `content/festivals`, with a JSON file for each edition
- Some related festivals are kept in the same folder (Desertfest, Heavy Psych Sounds...)
- The edition filename should contain the year and an optional discriminator for related festivals
- The content should follow the schema found in `src/content.config.ts`:
```javascript
{
    name: string;
    key: string; // same as past editions so they can be matched
    website: string;
    country: string;
    city: string;
    lat: number;
    lng: number;
    indoor: boolean; // indoor or open-air
    startDate: string;
    endDate: string;
    img: string; // path to .webp image in the same folder
    provisionalDate?: boolean; // if true dates will still be used for filtering but hidden
    playlistId?: string; // currently unused
    note?: string; // currently unused, freeform text
    lineup?: string[]; // array of band slugs
    partialLineup?: boolean; // shows a "+ many more..." note for very large lineups (too much work) 
}
```
- Every band on a lineup should also be listed in `content/bands.json` with the appropriate slug
- Missing bands can be added by running `pnpm update:bands` (optionally edit the file for casing or accents)
