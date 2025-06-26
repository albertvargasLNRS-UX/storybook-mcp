import { getStories } from "./getStories";

const run = async () => {
  const examples = [
    // Absolute path
    "/Users/danielwilliams/Workspace/storybook/repro/sb-react-ex/.storybook",
    // Relative path
    "../repro/sb-react-ex/.storybook",
    // this shit
    "./../repro/sb-react-ex/.storybook",
  ];

  for (const configDir of examples) {
    console.log(`\nTesting configDir: ${configDir}`);
    const stories = await getStories({ configDir });
    console.log(stories);
  }
};

run();
