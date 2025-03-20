# Storybook MCP Server

A Model Context Protocol server for interacting with Storybook.

## Usage

```bash
bun [path-to]/storybook-mcp/index.ts
```

## Tools

### get-stories

Retrieves a list of stories from a Storybook configuration.

**Parameters:**

- `configDir` (string): Absolute path to directory containing the .storybook config folder

**Returns:**

- List of stories in `{title}/{name}` format

## Technical Details

- Built using `@modelcontextprotocol/sdk`
- Uses stdio transport for communication
- Caches data in `./cache` relative to script location
