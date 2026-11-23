/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  // Stories live next to their components, for example Button/Button.stories.jsx
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx)"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  framework: "@storybook/react-vite",
  // Serve the public folder so poster images like /images/movies/inception.svg load in Storybook too.
  staticDirs: ["../public"],
};

export default config;
