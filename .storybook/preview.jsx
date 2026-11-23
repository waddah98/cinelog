import { MemoryRouter } from "react-router-dom";
import "../src/styles/globals.css";

/** @type { import('@storybook/react-vite').Preview } */
const preview = {
  // Components like MovieCard and Navbar use <Link>, which only works inside a router.
  // This decorator wraps every story in a MemoryRouter (a router that keeps the URL in memory).
  // A story can choose the starting URL with: parameters: { route: "/watchlist" }
  decorators: [
    (Story, context) => {
      let route = "/";
      if (context.parameters.route) {
        route = context.parameters.route;
      }
      return (
        <MemoryRouter initialEntries={[route]}>
          <Story />
        </MemoryRouter>
      );
    },
  ],
  parameters: {
    // Use the same dark background as the app.
    backgrounds: {
      options: {
        dark: { name: "Dark", value: "#0e0f13" },
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // Show accessibility problems in the "Accessibility" panel.
      test: "todo",
    },
  },
  initialGlobals: {
    backgrounds: { value: "dark" },
  },
};

export default preview;
