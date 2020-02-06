import fs from "fs";
import replace from "rollup-plugin-replace";
import { Config } from "@stencil/core";

const pkgManifest = JSON.parse(fs.readFileSync("package.json", "utf8"));

export const config: Config = {
  namespace: "mui-core",
  outputTargets: [
    {
      type: "dist",
      esmLoaderPath: "../loader"
    },
    {
      type: "docs-readme"
    },
    {
      type: "www",
      serviceWorker: null // disable service workers
    }
  ],
  plugins: [
    replace({
      exclude: "node_modules/**",
      delimiters: ["<@", "@>"],
      values: {
        NPM_PACKAGE_VERSION: pkgManifest.version
      }
    })
  ]
};
