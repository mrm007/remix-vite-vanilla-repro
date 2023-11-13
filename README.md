# Remix + Vite + Vanilla Extract repro

This is based off the [pathless routes] example, which was migrated to Remix 2 and Vite by following the [migration guide].

[pathless routes]: https://github.com/remix-run/examples/blob/main/pathless-routes
[migration guide]: https://remix.run/docs/en/main/future/vite#migrating

I then added styling using plain CSS and Vanilla Extract, and found different behaviours between `remix dev/build` and `vite dev/build`.

## Running `pnpm vite:dev` (without `emitCssInSsr: true`)

There is a flash of _styled_ content while the page is loading.
Styles defined via Vanilla Extract are removed once the page is fully loaded — [see video](./remix-flash.mp4).

## Running `pnpm vite:dev`

All styles are applied correctly.

## Running `pnpm vite:build` and `pnpm start`

None of the CSS defined via Vanilla Extract is extracted.

<details>

```
➜ pnpm vite:build && bat public/**/*.css

> remix-vite-vanilla-repro@ vite:build /___/remix-vite-vanilla-repro
> vite build && vite build --ssr

vite v4.5.0 building for production...

  ⚠️  Remix support for Vite is unstable
     and not recommended for production

✓ 57 modules transformed.

(!) The public directory feature may not work correctly. outDir /___/remix-vite-vanilla-repro/public/build and publicDir /___/remix-vite-vanilla-repro/public are not separate folders.

public/build/manifest.json                      1.48 kB │ gzip:  0.38 kB
public/build/assets/root-96936bc4.css           0.05 kB │ gzip:  0.07 kB
public/build/assets/_index-e04098c6.js          0.16 kB │ gzip:  0.15 kB
public/build/assets/articles-f8fce634.js        0.33 kB │ gzip:  0.24 kB
public/build/assets/root-4f3f1d61.js            2.27 kB │ gzip:  1.23 kB
public/build/assets/jsx-runtime-26afeca0.js     8.09 kB │ gzip:  3.04 kB
public/build/assets/components-4d660e34.js     75.51 kB │ gzip: 24.94 kB
public/build/assets/entry.client-e6d8db27.js  143.55 kB │ gzip: 46.57 kB
✓ built in 895ms
vite v4.5.0 building SSR bundle for production...

  ⚠️  Remix support for Vite is unstable
     and not recommended for production

✓ 12 modules transformed.
build/index.js  8.25 kB
✓ built in 205ms
───────┬────────────────────────────────────────────────────────────────────────────────────────
       │ File: public/build/assets/root-96936bc4.css
───────┼────────────────────────────────────────────────────────────────────────────────────────
   1   │ .global-active{--source: global-css;font-weight:700}
───────┴────────────────────────────────────────────────────────────────────────────────────────
```

</details>

However, traces of [Vanilla Extract's `injectStyles` helper][injectStyles] (minified) can be found in the `public/build/assets/root-4f3f1d61.js` bundle.

[injectStyles]: https://github.com/vanilla-extract-css/vanilla-extract/blob/8bed6f5ef36287006db458093e67bef5231e206c/packages/vite-plugin/src/index.ts#L128-L135

```js
const L = (s) =>
  _({
    fileScope: {
      filePath: "/___/remix-vite-vanilla-repro/app/styles.css.ts.vanilla.js",
    },
    css: s,
  });
L(`.styles_active__132nzvb0 {
  font-style: italic;
}`);
```

## Running `pnpm remix:dev`

All styles are applied correctly — [see video](./remix-okay.mp4).

## Running `pnpm remix:build` and `pnpm start`

All styles are applied correctly.

<details>

```
➜ pnpm remix:build && bat public/**/*.css

> remix-vite-vanilla-repro@ remix:build /___/remix-vite-vanilla-repro
> remix build

 info  building... (NODE_ENV=production)
 info  built (646ms)
───────┬────────────────────────────────────────────────────────────────────────────────────────
       │ File: public/build/css-bundle-6PUAMUZJ.css
───────┼────────────────────────────────────────────────────────────────────────────────────────
   1   │ .global-active{--source: global-css;font-weight:700}
       │ .global-vanilla-active{--n2ssuc0: global-vanilla-css;font-size:1.5em}
       │ .zeldvp0{font-style:italic}
───────┴────────────────────────────────────────────────────────────────────────────────────────
───────┬────────────────────────────────────────────────────────────────────────────────────────
       │ File: public/build/root-ALTJ3KJN.css
───────┼────────────────────────────────────────────────────────────────────────────────────────
   1   │ .global-active{--source: global-css;font-weight:700}
───────┴────────────────────────────────────────────────────────────────────────────────────────
```

</details>

### Bonus

Uncommenting the line `import "./global.vanilla.css";` crashes the build.
I suspect this is because the name of the file matches the [internally-created virtual modules], but I haven't dug deeper.

[internally-created virtual modules]: https://github.com/remix-run/remix/blob/5311c885b0ca168c1d8d368b8a33ed31d9c7c27a/packages/remix-dev/compiler/plugins/vanillaExtract.ts#L112

<details>

```
➜ pnpm remix:build

> remix-vite-vanilla-repro@ remix:build /___/remix-vite-vanilla-repro
> remix build

 info  building... (NODE_ENV=production)
✘ [ERROR] Build failed with 1 error:
node_modules/.pnpm/@vanilla-extract+integration@6.2.3/node_modules/@vanilla-extract/integration/dist/vanilla-extract-integration.cjs.dev.js:827:14: ERROR: [plugin: vanilla-extract-plugin] No CSS for file: /___/remix-vite-vanilla-repro/app/global [plugin css-bundle-plugin]

    app/root.tsx:11:30:
      11 │ import { cssBundleHref } from "@remix-run/css-bundle";
         ╵                               ~~~~~~~~~~~~~~~~~~~~~~~

  This error came from the "onLoad" callback registered here:

    node_modules/.pnpm/@remix-run+dev@2.2.0_@remix-run+serve@2.2.0_typescript@5.2.2_vite@4.5.0/node_modules/@remix-run/dev/dist/compiler/plugins/cssBundlePlugin.js:35:12:
      35 │       build.onLoad({
         ╵             ~~~~~~

    at setup (/___/remix-vite-vanilla-repro/node_modules/.pnpm/@remix-run+dev@2.2.0_@remix-run+serve@2.2.0_typescript@5.2.2_vite@4.5.0/node_modules/@remix-run/dev/dist/compiler/plugins/cssBundlePlugin.js:35:13)
    at handlePlugins (/___/remix-vite-vanilla-repro/node_modules/.pnpm/esbuild@0.17.6/node_modules/esbuild/lib/main.js:1279:21)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)


 ELIFECYCLE  Command failed with exit code 1.

```

</details>
