const esbuild = require("esbuild");
const dotenv = require("dotenv");
dotenv.config();

esbuild
  .build({
    entryPoints: ["src/index.ts"],
    bundle: true,
    outdir: "dist",
    platform: "node",
    plugins: [],
  })
  .catch(() => process.exit(1));
