import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["./index.ts"],
  outDir: "./dist",
  format: ["cjs"],
  target: "node22",
});
