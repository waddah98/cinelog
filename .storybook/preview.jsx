import { MemoryRouter } from "react-router";
import { Provider } from "react-redux";
import { store } from "../src/store/store";
import "../src/styles/globals.css";

/** @type { import('@storybook/react-vite').Preview } */
const preview = {
  // Components like MovieCard and Navbar use <Link>, which only works inside a router.
  // MemoryRouter is a router that keeps the URL in memory, so every story gets one.
  // The Navbar reads the watchlist count with useSelector, so stories also need the Redux store (Provider).
  decorators: [
    (Story) => (
      <Provider store={store}>
        <MemoryRouter>
          <Story />
        </MemoryRouter>
      </Provider>
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
