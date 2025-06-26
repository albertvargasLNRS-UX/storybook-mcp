import { StoryIndex } from "storybook/internal/types";

export async function getStories({ configDir }: { configDir: string }) {
  process.env.CACHE_DIR = __dirname + "/cache";

  const { buildIndex } = require("storybook/internal/core-server");

  const index: StoryIndex = await buildIndex({ configDir });

  return Object.entries(index.entries)
    .filter(([_, entry]) => entry.type === "story")
    .map(([storyId, _entry]) => storyId)
    .join("\n");
}
