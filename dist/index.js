#!/usr/bin/env node
//#region rolldown:runtime
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));

//#endregion
const __modelcontextprotocol_sdk_server_mcp_js = __toESM(require("@modelcontextprotocol/sdk/server/mcp.js"));
const __modelcontextprotocol_sdk_server_stdio_js = __toESM(require("@modelcontextprotocol/sdk/server/stdio.js"));
const zod = __toESM(require("zod"));

//#region getStories.ts
async function getStories({ configDir }) {
	process.env.CACHE_DIR = __dirname + "/cache";
	const { buildIndex } = require("storybook/internal/core-server");
	try {
		const index = await buildIndex({ configDir });
		return Object.entries(index.entries).filter(([_, entry]) => entry.type === "story").map(([storyId, _entry]) => storyId).join("\n");
	} catch (error) {
		return `Error building index with configDir ${configDir} and error\n${error}\n\nmake sure you are passing the correct configDir`;
	}
}

//#endregion
//#region index.ts
const server = new __modelcontextprotocol_sdk_server_mcp_js.McpServer({
	name: "storybook",
	version: "1.0.0"
});
server.tool("get-stories", "Get a list of story ids for your storybook project, use this to list stories.", { configDir: zod.z.string().min(1).describe("The absolute path to directory containing the .storybook config folder").default(`${process.cwd()}/.storybook`) }, async ({ configDir }) => {
	return { content: [{
		type: "text",
		text: await getStories({ configDir })
	}] };
});
async function main() {
	const transport = new __modelcontextprotocol_sdk_server_stdio_js.StdioServerTransport();
	console.error("Server starting...");
	await server.connect(transport);
	console.error("Server started successfully");
}
main().catch((error) => {
	console.error("Fatal error in main():", error);
	process.exit(1);
});

//#endregion