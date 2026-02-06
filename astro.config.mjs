// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import svgr from "vite-plugin-svgr";

import sitemap from "@astrojs/sitemap";

export default defineConfig({
  integrations: [react(), icon(), sitemap()],
  site: "https://fuzzyfest.live",
  vite: {
    plugins: [tailwindcss(), svgr()],
  },
  prefetch: true,
});