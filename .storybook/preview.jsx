import { MemoryRouter } from "react-router";
import "../src/styles/globals.css";

/** @type { import('@storybook/react-vite').Preview } */
const preview = {
  // Components like MovieCard and Navbar use <Link>, which only works inside a router.
  // MemoryRouter is a router that keeps the URL in memory, so every story gets one.
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
