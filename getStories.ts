import { StoryIndex } from "storybook/internal/types";

export async function getStories({ configDir }: { configDir: string }) {
  process.env.CACHE_DIR = __dirname + "/cache";

  const { buildIndex } = require("storybook/internal/core-server");

  try {
    const index: StoryIndex = await buildIndex({ configDir });
    return Object.entries(index.entries)
      .filter(([_, entry]) => entry.type === "story")
      .map(([storyId, _entry]) => storyId)
      .join("\n");
  } catch (error) {
    return `Error building index with configDir ${configDir} and error\n${error}\n\nmake sure you are passing the correct configDir`;
  }
}
