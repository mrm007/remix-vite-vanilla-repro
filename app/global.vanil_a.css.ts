import { createVar, globalStyle } from "@vanilla-extract/css";

const source = createVar();

globalStyle(".global-vanilla-active", {
  vars: {
    [source]: "global-vanilla-css",
  },
  fontSize: "1.5em",
});
