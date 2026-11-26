# CineTrack

CineTrack is a small movie discovery and tracking app built with React for a beginner React examination.
You can browse a mock movie catalog, open a movie's details, keep a personal watchlist, mark movies as
watched, and see simple watching statistics on your profile.

Everything runs in the browser: there is **no backend, no login and no external API**. Movie data comes
from a local file and your watchlist lives in a Redux store, saved in the browser's `localStorage` by Redux Persist.

> **Documentation:** the [`docs/`](docs/README.md) folder explains how every screen was built, which React
> concepts from the course it uses, and the questions to expect during the presentation.

## Main features

- **Home** (`/`): featured movie banner, Trending, Top rated and Recently added sections.
- **Explore** (`/explore`): search by title, filter by genre, and sort by rating, year or title. All three work together, and "Clear filters" resets them.
- **Movie Details** (`/movies/:movieId`): poster, backdrop, metadata, genres, director, overview and cast, plus watchlist actions. An unknown id shows a "Movie not found" message.
- **My Watchlist** (`/watchlist`): saved movies with an All / Planned / Watched filter. You can mark a movie as watched, move it back to planned, or remove it.
- **Profile** (`/profile`): mock user, watchlist counts, favorite genres and recently watched movies, all calculated from the saved watchlist.
- Unknown URLs show a "Page not found" fallback.
- Changes to the watchlist are still there after you refresh the page.
- Responsive layout (mobile, tablet and desktop) with a compact mobile menu.

## Technology stack

| Technology | Used for |
|---|---|
| React (JavaScript / JSX) | UI and application logic |
| Vite | Development server and build |
| React Router | Pages and the `:movieId` URL parameter |
| CSS (with variables, flexbox, grid, media queries) | Styling and responsive layout |
| Storybook | Developing and documenting components in isolation |
| Redux Toolkit + react-redux | The shared watchlist store (slice, actions, `useSelector`, `useDispatch`) |
| Redux Persist | Saving the watchlist in `localStorage` and restoring it after a refresh |

## Getting started

You need [Node.js](https://nodejs.org/) (version 20 or newer).

```bash
# Install dependencies
npm install

# Run the React application (http://localhost:5173)
npm run dev

# Run Storybook (http://localhost:6006)
npm run storybook

# Create the production application build (output in dist/)
npm run build

# Build Storybook as a static site (output in storybook-static/)
npm run build-storybook
```

## Architecture: Atomic Design

Components are organised from the smallest to the largest:

| Level | What it is | Components |
|---|---|---|
| **Atoms** | Smallest building blocks | Button, IconButton, Input, Select, Badge, Avatar, Poster, Rating |
| **Molecules** | Small groups of atoms | SearchBar, MovieCard, GenreTag, MovieMetadata, StatCard, UserSummary, EmptyState |
| **Organisms** | Larger, independent sections | Navbar, HeroBanner, MovieGrid, FilterPanel, MovieSection, ProfileSummary, WatchlistSummary, GenreStatistics |
| **Templates** | Page layouts without real data | MainLayout, CatalogLayout |
| **Pages** | Connect routes, data and the Redux store | HomePage, ExplorePage, MovieDetailsPage, WatchlistPage, ProfilePage (+ NotFoundPage fallback) |

Components never load data themselves. Pages read the data and the Redux store, then pass everything down through props. The only other component that reads the store is the `Navbar` (for the watchlist count).
For example, `MovieCard` is reused on Home, Explore, Watchlist and Profile, and it always receives its
`movie`, its `status` and its click handlers from the parent.

### Folder structure

```text
cinetrack/
├── .storybook/            Storybook configuration (main.js, preview.jsx)
├── public/images/         Local poster/backdrop images and the avatar
├── src/
│   ├── components/
│   │   ├── atoms/         One folder per component: Name.jsx, Name.css, Name.stories.jsx
│   │   ├── molecules/
│   │   └── organisms/
│   ├── templates/         MainLayout, CatalogLayout
│   ├── pages/             The five pages + NotFoundPage
│   ├── store/             store.js (Redux store + Redux Persist)
│   ├── features/          watchlistSlice.js (the watchlist slice)
│   ├── data/              movies.js (catalog), user.js (mock user)
│   ├── routes/            AppRouter.jsx (all routes)
│   ├── styles/            variables.css (design tokens), globals.css
│   ├── App.jsx
│   └── main.jsx
└── package.json
```

## State management (Redux Toolkit)

- **`src/features/watchlistSlice.js`** is created with `createSlice`. Its state is `{ items: [] }` and its actions are `ADD_TO_WATCHLIST`, `REMOVE_FROM_WATCHLIST`, `MARK_AS_WATCHED`, `MARK_AS_PLANNED` and `TOGGLE_WATCHLIST`. It also exports a small `getStatus(items, movieId)` helper. Duplicates are prevented in the reducers.
- **`src/store/store.js`** combines the reducers, wraps them with `persistReducer` (whitelist: `watchlist`) and exports `store` and `persistor`.
- **`main.jsx`** wraps the app in `<Provider store={store}>` and `<PersistGate loading={null} persistor={persistor}>`.
- Pages read the watchlist with `useSelector((state) => state.watchlist.items)` and change it with `dispatch(ACTION(payload))`. The date of an action is created in the page and sent in the payload, so the reducers stay pure.

The search, genre and sort state of the Explore page lives directly in `ExplorePage` (the page owns the state and passes it to `FilterPanel` through props).

## Mock data and persistence

- `src/data/movies.js` holds the only copy of the movie catalog: 20 movies with unique string ids (for example `"inception"`) and the same fields on every movie. Every page imports from this file.
- `src/data/user.js` holds the static mock user shown on the Profile page.
- Redux Persist saves the store under the `localStorage` key **`persist:root`**. The watchlist is an array of entries (`state.watchlist.items`):

  ```js
  { movieId: "inception", status: "watched", addedAt: "2026-11-10T10:00:00.000Z", watchedAt: "2026-11-12T20:00:00.000Z" }
  ```

  Only the id and the user's tracking information are stored. Titles, posters and so on always come from the catalog.
- Profile statistics are **not stored**: they are calculated from the watchlist every time the page renders, so they are always correct.
- To reset the app, clear the site data in your browser (or delete the `persist:root` key in DevTools → Application → Local Storage).

## Storybook

Storybook shows every component on its own, outside the app. Stories sit next to their components (for example
`MovieCard/MovieCard.stories.jsx`) and use the same mock data as the app. They cover the important states:
default, disabled, empty, with data, active navigation, missing image, and so on. Use the **Controls** panel to change props and the
**Actions** panel to see button clicks.

## Assumptions and known limitations

- No backend, no authentication and no external movie API. This is intentional.
- The poster and backdrop images are generated placeholder artwork (local SVG files), not official movie posters, so the app works offline and avoids copyright problems. Movie text (overviews) is written for this project.
- The watchlist is stored per browser. Another browser or device starts with an empty watchlist.
- The Profile user is a static mock object and cannot be edited.
