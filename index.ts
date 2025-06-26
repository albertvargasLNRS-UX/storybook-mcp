#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { buildIndex } from "storybook/internal/core-server";
// import { execSync, spawnSync } from "child_process";
// import { StoryIndex } from "storybook/internal/types";
// import path from "path";

process.env.CACHE_DIR = __dirname + "/cache";

const server = new McpServer({
  name: "storybook",
  version: "1.0.0",
});

server.tool(
  "get-stories",
  "Get stories from storybook",
  {
    configDir: z
      .string()
      .min(1)
      .describe(
        "The absolute path to directory containing the .storybook config folder"
      ),
  },
  async ({ configDir }) => {
    // Override process.cwd to return the parent directory of configDir
    // process.chdir(path.resolve(configDir, ".."));
    // const output = execSync(`npx storybook@latest index -c ${configDir}`);
    // const index = JSON.parse(output.toString()) as StoryIndex;

    console.log("configDir", configDir);
    console.log("cwd", process.cwd());
    const index = await buildIndex({ configDir });

    const content = Object.entries(index.entries)
      .filter(([_, entry]) => entry.type === "story")
      .map(([_storyId, entry]) => `${entry.title}/${entry.name}`)
      .join("\n");

    return {
      content: [
        {
          type: "text",
          text: content,
        },
      ],
    };
  }
);

// server.tool(
//   'go-to-story',
//   'Go to a story',
//   {
//     storyKind: z.string(),
//     storyName: z.string(),
//   },
//   async ({ storyKind, storyName }) => {
//     const storyId = toId(storyKind, storyName);
//     return {
//       content: [],
//     };
//   }
// );

async function main() {
  const transport = new StdioServerTransport();
  console.error("Server starting...");
  await server.connect(transport);
  console.error("Server started successfully");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
