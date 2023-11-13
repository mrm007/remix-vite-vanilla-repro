import { unstable_vitePlugin as remix } from "@remix-run/dev";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { defineConfig } from "vite";

import remixConfig from "./remix.config.cjs";

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    remix(remixConfig),
    vanillaExtractPlugin({
      emitCssInSsr: true, // ! flash of *styled* content without it
    }),
  ],
  // for easier debugging
  clearScreen: false,
  build: {
    minify: false,
  },
});
