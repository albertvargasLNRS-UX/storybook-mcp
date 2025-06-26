import { getStories } from "./getStories";

const run = async () => {
  const stories = await getStories({
    configDir:
      "/Users/danielwilliams/Workspace/storybook/repro/sb-react-ex/.storybook",
  });
  console.log(stories);
};

run();
