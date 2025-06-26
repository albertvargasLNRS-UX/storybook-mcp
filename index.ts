#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { getStories } from "./getStories";

const server = new McpServer({
  name: "storybook",
  version: "1.0.0",
});

server.tool(
  "get-stories",
  "Get a list of story ids for your storybook project, use this to list stories.",
  {
    configDir: z
      .string()
      .min(1)
      .describe(
        "The absolute path to directory containing the .storybook config folder"
      )
      .default(`${process.cwd()}/.storybook`),
  },
  async ({ configDir }) => {
    return {
      content: [
        {
          type: "text",
          text: await getStories({ configDir }),
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
