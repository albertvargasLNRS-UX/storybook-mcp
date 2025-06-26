import { StoryIndex } from "storybook/internal/types";
import * as path from "path";
import * as fs from "fs";

async function getIndex({ configDir }: { configDir: string }) {
  process.env.CACHE_DIR = __dirname + "/cache";
  const { buildIndex } = require("storybook/internal/core-server");
  const index: StoryIndex = await buildIndex({
    configDir,
  });

  return Object.entries(index.entries)
    .filter(([_, entry]) => entry.type === "story")
    .map(([storyId, _entry]) => storyId)
    .join("\n");
}

async function tryToResolveConfigDir({ configDir }: { configDir: string }) {
  const mainFiles = ["main.js", "main.ts", "main.mjs", "main.cjs"];
  const cwd = process.cwd();
  const parentDir = path.dirname(cwd);
  const configDirNoDot = configDir.startsWith("./")
    ? configDir.slice(2)
    : configDir;
  const baseDirs =
    configDir !== configDirNoDot ? [configDir, configDirNoDot] : [configDir];

  let possibleDirs: string[] = [];
  for (const base of baseDirs) {
    possibleDirs.push(
      path.isAbsolute(base) ? base : path.resolve(base),
      path.resolve(cwd, base),
      path.join(cwd, ".storybook"),
      path.join(__dirname, base),
      path.resolve(parentDir, base),
      path.join(parentDir, ".storybook")
    );
  }

  possibleDirs = Array.from(new Set(possibleDirs));

  let resolvedConfigDir: string | null = null;

  for (const dir of possibleDirs) {
    for (const mainFile of mainFiles) {
      if (fs.existsSync(path.join(dir, mainFile))) {
        resolvedConfigDir = dir;
        break;
      }
    }
    if (resolvedConfigDir) break;
  }

  if (resolvedConfigDir) {
    try {
      return getIndex({ configDir: resolvedConfigDir });
    } catch (error) {
      return String(error);
    }
  } else {
    return [
      `Error building index with configDir ${resolvedConfigDir}`,
      `make sure you are passing the correct configDir`,
      `Checked: ${possibleDirs.join(", ")}`,
    ].join("\n\n");
  }
}

export async function getStories({ configDir }: { configDir: string }) {
  try {
    return getIndex({ configDir });
  } catch (error) {
    // Resolve configDir to an absolute path and check for main.js, main.ts, main.mjs, main.cjs
    return tryToResolveConfigDir({ configDir });
  }
}
