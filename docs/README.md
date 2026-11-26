# CineTrack — Project documentation

This folder explains how every screen of CineTrack was built, which React concepts from the course it uses,
and how to answer the questions you may get during the presentation.

| Document | Screen | URL |
|---|---|---|
| [01 — Architecture overview](#architecture-overview) (this file) | Shared parts used by every screen | — |
| [02 — Home page](02-home-page.md) | Featured movie + three movie sections | `/` |
| [03 — Explore page](03-explore-page.md) | Search, genre filter and sort | `/explore` |
| [04 — Movie details page](04-movie-details-page.md) | One movie + watchlist actions | `/movies/:movieId` |
| [05 — Watchlist page](05-watchlist-page.md) | Saved movies with a status filter | `/watchlist` |
| [06 — Profile page](06-profile-page.md) | User card + statistics | `/profile` |
| [07 — Not found page](07-not-found-page.md) | Fallback for unknown URLs | any other URL |

Each screen document follows the same plan:

1. **What the user sees**: the purpose of the screen.
2. **Component tree**: which atoms, molecules, organisms and template build it.
3. **State and data**: where the data comes from and where the state lives.
4. **Step by step**: what happens in the code when the user clicks.
5. **Course concepts used**: with the chapter where we saw them.
6. **Questions you might be asked**: with short answers.

---

## Architecture overview

### 1. What CineTrack is

CineTrack is a movie discovery and tracking app. The user can browse a catalog of 20 movies, open the
details of a movie, save movies in a watchlist, mark them as watched, and see statistics on a profile page.

There is **no backend**: the movies come from a local JavaScript file. The watchlist lives in a
**Redux store**, and **Redux Persist** saves it in the browser, so it is still there after a refresh.

### 2. Tools (all seen in class)

| Tool | Why | Chapter |
|---|---|---|
| **Vite** (`npm create vite@latest -- --template react`) | Creates and runs the React project | Ch. 3 — Installation |
| **React** function components + hooks | The whole interface | Ch. 3, 4, 6 |
| **React Router** (`react-router`) | One URL per screen, navigation without reloading | Ch. 5 |
| **Redux Toolkit** + **react-redux** | One shared store for the watchlist, read and changed from any page | Ch. 7 |
| **Redux Persist** | Saves the watchlist part of the store, restores it after a refresh | Ch. 7 |
| **Storybook** | Shows each component alone, with its different states | Ch. 8 |
| **CSS files** (one per component) | Styling and responsive layout | — |

### 3. Folder structure (Atomic Design, Chapter 8)

```
src/
├── main.jsx                 Entry point: createRoot + StrictMode + BrowserRouter
├── App.jsx                  Renders the router
├── routes/AppRouter.jsx     All the <Route> of the app
├── components/
│   ├── atoms/               Smallest pieces: Button, IconButton, Input, Select, Badge, Avatar, Poster, Rating
│   ├── molecules/           Atoms combined: SearchBar, MovieCard, MovieMetadata, GenreTag, EmptyState, StatCard, UserSummary
│   └── organisms/           Big parts of a screen: Navbar, HeroBanner, MovieGrid, MovieSection, FilterPanel,
│                            WatchlistSummary, GenreStatistics, ProfileSummary
├── templates/               Page structure: MainLayout, CatalogLayout
├── pages/                   One folder per screen: HomePage, ExplorePage, MovieDetailsPage, WatchlistPage,
│                            ProfilePage, NotFoundPage
├── store/store.js           The Redux store (configureStore + Redux Persist)
├── features/watchlistSlice.js  The watchlist slice: its state, its reducers and its actions
├── data/                    movies.js (the catalog), user.js (the mock user)
└── styles/                  variables.css (colors, sizes), globals.css
```

Rule from the course: **one folder per level, one file per component**. Each component folder contains
`Name.jsx` (the component), `Name.css` (its style) and `Name.stories.jsx` (its Storybook stories).

### 4. The five Atomic Design levels in CineTrack

| Level | Role (course definition) | Example in CineTrack |
|---|---|---|
| **Atom** | Smallest piece, one responsibility | `Button` only shows a button with a `variant` and a `size` |
| **Molecule** | A few atoms together = a small unit | `SearchBar` = `Input` + `IconButton` (✕ clear button) |
| **Organism** | A significant part of the interface | `FilterPanel` = `SearchBar` + two `Select` + `Button` |
| **Template** | The structure of a page, without the real content | `MainLayout` = Navbar + `<main>` + footer |
| **Page** | A template filled with the real data and the state | `ExplorePage` owns the search/genre/sort state |

**Communication between levels (Chapter 8, slide "Communication entre les composants"):**
the **page owns the state**, then passes **data and functions down through props**. The small components
never change the data themselves: they call the function they received (a *callback*).

```
ExplorePage   (state: search, selectedGenre, sortBy)
   │  props: search, onSearchChange={setSearch}, ...
   ▼
FilterPanel
   │  props: value={search}, onChange={onSearchChange}
   ▼
SearchBar ──► Input   (the user types → onChange is called → the page state changes → React re-renders)
```

### 5. Entry point and routing (Chapter 5)

[`main.jsx`](../src/main.jsx) is exactly the structure from the course (Chapter 7, Redux Persist slide):

```jsx
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </StrictMode>
);
```

- `createRoot` creates the React root inside `<div id="root">`.
- `StrictMode` helps find problems during development.
- `Provider` (react-redux) gives every component access to the Redux store.
- `PersistGate` waits until Redux Persist has restored the saved watchlist before showing the app.
  `loading={null}` means nothing is shown during this very short wait.
- `BrowserRouter` gives every component access to the URL.

[`AppRouter.jsx`](../src/routes/AppRouter.jsx) lists all the routes in one place:

| Path | Page | Note |
|---|---|---|
| `/` | `HomePage` | First screen |
| `/explore` | `ExplorePage` | |
| `/movies/:movieId` | `MovieDetailsPage` | **Dynamic route**: `:movieId` is read with `useParams()` |
| `/watchlist` | `WatchlistPage` | |
| `/profile` | `ProfilePage` | |
| `*` | `NotFoundPage` | **404**: matches every URL that no other route matches |

Navigation without reloading the page uses the three tools from the course:
`<Link>` (movie titles, "See all"), `<NavLink>` (the Navbar, it adds the class `active` to the current page)
and `useNavigate()` (buttons such as "View details" or "Explore movies").

### 6. Shared parts used by every screen

#### `MainLayout` (template) — [`MainLayout.jsx`](../src/templates/MainLayout/MainLayout.jsx)

Every page is wrapped in `MainLayout`, which shows the `Navbar`, the page content (`children`) and the footer.

- It uses the special prop **`children`** (Chapter 4): whatever the page puts between
  `<MainLayout>` and `</MainLayout>` is displayed inside `<main>`.
- It has one `useEffect` with an **empty dependency array** (Chapter 5, "useEffect au montage"):
  when a new page appears, it runs `window.scrollTo(0, 0)` so the new page starts at the top.

#### `Navbar` (organism) — [`Navbar.jsx`](../src/components/organisms/Navbar/Navbar.jsx)

- Four `NavLink`s: Home, Explore, Watchlist (with the count), Profile.
- The count is read **directly from the Redux store**:
  `const watchlistCount = useSelector((state) => state.watchlist.items.length);`
  This is the advantage of a store: the Navbar gets the data itself, no page has to pass it through props.
- `NavLink to="/" end`: `end` means "only active on exactly `/`", otherwise Home would be highlighted on every page.
- **Local state** `isMenuOpen` (`useState(false)`) for the mobile menu. The ☰ button calls `toggleMenu`, which
  does `setIsMenuOpen(!isMenuOpen)`. When the state is `true`, the class `navbar__links--open` is added
  and the CSS shows the links.
- The ☰ button is hidden on screens wider than 768px with a CSS media query.

#### The Redux store — [`store/store.js`](../src/store/store.js) and [`features/watchlistSlice.js`](../src/features/watchlistSlice.js)

The heart of the app. Chapter 7: "`useState` keeps a state **local** to one component. Several components
need the same data. Redux **centralizes** the shared data in a **store**, and every change goes through an
**action**." The watchlist is needed by every page (and by the Navbar), so it lives in the store.

**The Redux circuit in 4 steps (Chapter 7):**

```
1. The user clicks a button               (MovieCard "+")
2. useDispatch sends an action            dispatch(TOGGLE_WATCHLIST({ movieId, date }))
3. The reducer of the slice updates       state.items.push(...)
   the state
4. useSelector reads the new state        useSelector((state) => state.watchlist.items)
   and React updates the display          -> the card shows ✓, the Navbar count changes
```

**The slice** (`createSlice`, written like the course's `counterSlice`):

```js
const initialState = { items: [] };

const watchlistSlice = createSlice({
  name: "WATCHLIST",
  initialState,
  reducers: {
    ADD_TO_WATCHLIST(state, action) { ... },
    REMOVE_FROM_WATCHLIST(state, action) { ... },
    MARK_AS_WATCHED(state, action) { ... },
    MARK_AS_PLANNED(state, action) { ... },
    TOGGLE_WATCHLIST(state, action) { ... },
  },
});

export const { ADD_TO_WATCHLIST, REMOVE_FROM_WATCHLIST, MARK_AS_WATCHED, MARK_AS_PLANNED, TOGGLE_WATCHLIST } =
  watchlistSlice.actions;
export default watchlistSlice.reducer;
```

| Action | Payload | What the reducer does |
|---|---|---|
| `ADD_TO_WATCHLIST` | `{ movieId, date }` | Adds a `"planned"` entry (does nothing if already saved: no duplicates) |
| `REMOVE_FROM_WATCHLIST` | `movieId` | Keeps every entry except this one (`filter`) |
| `MARK_AS_WATCHED` | `{ movieId, date }` | Changes the status to `"watched"`; adds the movie if it was not saved |
| `MARK_AS_PLANNED` | `movieId` | Changes the status back to `"planned"` |
| `TOGGLE_WATCHLIST` | `{ movieId, date }` | Adds if missing, removes if saved (used by the bookmark buttons) |

- `createSlice` creates the actions automatically: `TOGGLE_WATCHLIST(payload)` returns the object
  `{ type: "WATCHLIST/TOGGLE_WATCHLIST", payload: payload }`.
- Inside a `createSlice` reducer we can write `state.items.push(...)` or `entry.status = "watched"`, like
  `state.value += 1` in the course. Redux Toolkit turns this into a **new state** behind the scenes, so the
  rule "a reducer returns a new state without modifying the old one" is still respected.
- **Why is the date in the payload?** A reducer must be a **pure function** (Chapter 7): same state + same
  action = same result. `new Date()` gives a different value each time, so the page creates the date and sends
  it inside the action.
- `getStatus(items, movieId)` is a small helper exported from the same file (not a reducer): it returns
  `"none"`, `"planned"` or `"watched"`.

**The store** (written like the course's `store.js`):

```js
const rootReducer = combineReducers({
  watchlist: watchlistReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["watchlist"],
};

export const store = configureStore({
  reducer: persistReducer(persistConfig, rootReducer),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
```

- `combineReducers`: lists the parts of the store. `state.watchlist` is managed by the watchlist reducer.
- `persistConfig`: Redux Persist saves the store under the key `persist:root` in the browser's
  `localStorage`. The **whitelist** says which parts are saved: here, `watchlist`.
- `ignoredActions`: the Redux Persist actions are ignored by the "serializable" check of Redux Toolkit
  (same lines as in the course).
- `storage` is imported from `redux-persist/es/storage`: it is the same localStorage storage as
  `redux-persist/lib/storage`, but in the format that Vite can load (with `lib/storage` the app crashes with
  "storage.getItem is not a function").

**One watchlist entry:**

```js
{ movieId: "inception", status: "planned", addedAt: "2026-11-10T10:00:00.000Z", watchedAt: null }
```

Only the id is saved, never the title or poster: the movie details always come from `data/movies.js`,
so there is a single copy of the movie data.

**How a page uses the store** (the same lines in Home, Explore, Watchlist and Profile):

```js
const watchlist = useSelector((state) => state.watchlist.items);
const dispatch = useDispatch();

function getMovieStatus(movieId) {
  return getStatus(watchlist, movieId);
}

function handleToggleWatchlist(movieId) {
  dispatch(TOGGLE_WATCHLIST({ movieId: movieId, date: new Date().toISOString() }));
}
```

The page then passes `getMovieStatus` and `handleToggleWatchlist` to its organisms through props, so the
atoms and molecules stay simple and do not know about Redux (Chapter 8).

#### The data — [`data/movies.js`](../src/data/movies.js) and [`data/user.js`](../src/data/user.js)

- `movies`: an array of 20 movie objects, all with the same fields
  (`id, title, year, duration, rating, genres, director, poster, backdrop, overview, cast, isTrending, isFeatured, addedAt`).
- `getMovieById(movieId)`: returns the movie with this id, or `undefined`.
- `getAllGenres()`: builds the list of every genre (without duplicates thanks to `includes`), sorted A–Z.
- `mockUser`: the fake user shown on the Profile page (there is no login).

### 7. Reusable components (quick reference)

| Component | Level | Props | Used in |
|---|---|---|---|
| `Button` | Atom | `children, variant, size, type, disabled, onClick` | Almost every page |
| `IconButton` | Atom | `icon, label, onClick, disabled, active` | MovieCard bookmark, Navbar ☰, SearchBar ✕ |
| `Input` | Atom | `id, label, value, onChange, placeholder, type` | SearchBar |
| `Select` | Atom | `id, label, value, options, onChange` | FilterPanel |
| `Badge` | Atom | `children, variant` | Status, genre, "Featured" |
| `Avatar` | Atom | `src, name, size` (shows initials if the image fails) | UserSummary |
| `Poster` | Atom | `src, alt, title, aspectRatio` (🎬 fallback if the image fails) | MovieCard, details page |
| `Rating` | Atom | `value` → "★ 8.8/10" | MovieMetadata |
| `GenreTag` | Molecule | `genre` (a `Badge` with `variant="genre"`) | Cards, banner, details |
| `MovieMetadata` | Molecule | `year, duration, rating` (each one optional) | Cards, banner, details |
| `SearchBar` | Molecule | `id, value, onChange, placeholder` | FilterPanel |
| `MovieCard` | Molecule | `movie, status, onToggleWatchlist, onMarkWatched, onMarkPlanned, onRemove` | MovieGrid |
| `EmptyState` | Molecule | `icon, title, message, actionLabel, onAction` | Every empty list, 404 |
| `StatCard` | Molecule | `label, value, description` | WatchlistSummary |
| `UserSummary` | Molecule | `name, bio, avatar` | ProfileSummary |
| `Navbar` | Organism | none (reads the count with `useSelector`) | MainLayout |
| `HeroBanner` | Organism | `movie, isInWatchlist, onViewDetails, onToggleWatchlist` | Home |
| `MovieGrid` | Organism | `movies, getStatus`, the 4 callbacks, `empty...` props | Explore, Watchlist, MovieSection |
| `MovieSection` | Organism | `title, description, actionLabel, actionTo, movies, ...` | Home, Profile |
| `FilterPanel` | Organism | search/genre/sort values + their callbacks, `resultCount` | Explore |
| `WatchlistSummary` | Organism | `total, planned, watched` | Watchlist, Profile |
| `GenreStatistics` | Organism | `genreCounts` | Profile |
| `ProfileSummary` | Organism | `user, favoriteGenre` | Profile |

**Default prop values** (Chapter 4): written directly in the destructuring, for example
`function Button({ variant = "primary", size = "medium", ... })`.

### 8. Responsive design

- `MovieGrid` uses CSS Grid, **mobile first**: 2 columns, then 3 (≥ 640px), 4 (≥ 900px) and 5 (≥ 1100px)
  with media queries in [`MovieGrid.css`](../src/components/organisms/MovieGrid/MovieGrid.css).
- The Navbar shows a ☰ menu button on small screens and the full link list from 768px.
- Colors and spacing are CSS variables in [`variables.css`](../src/styles/variables.css), so the whole app
  stays consistent.

### 9. Storybook (Chapter 8)

Run `npm run storybook` and open `http://localhost:6006`. Every component has a `.stories.jsx` file next to it,
written like the course example:

```jsx
export default {
  title: "Atoms/Button",
  component: Button,
  tags: ["autodocs"],
  args: { children: "Add to watchlist", variant: "primary", size: "medium", disabled: false },
};

export const Primary = {};
export const Danger = { args: { variant: "danger", children: "Remove" } };
```

- `title`: where the story appears in the Storybook menu (Atoms / Molecules / Organisms / Templates).
- `args`: the props given to the component. They can be changed live in the **Controls** panel.
- `tags: ["autodocs"]`: generates a documentation page.
- [`.storybook/preview.jsx`](../.storybook/preview.jsx) loads the global CSS and wraps each story in a
  `MemoryRouter`, because components such as `MovieCard` contain a `<Link>`, which only works inside a router.

### 10. Choices you should be ready to explain

| Choice | Reason |
|---|---|
| **Redux Toolkit for the watchlist** | The watchlist is shared by every page and by the Navbar. Chapter 7: shared data goes in a store, and every change is a named action (easy to follow in Redux DevTools). |
| **Redux Persist** | The watchlist must survive a refresh. Redux Persist saves the `watchlist` part of the store (whitelist) and `PersistGate` restores it at start-up. |
| **Local `useState` for the screen state** | The search, the filters and the mobile menu only matter on one screen and do not need to be saved, so they stay in `useState` (Chapter 7: "useState keeps a state local to the component"). |
| **The page dispatches, the atoms do not** | Only pages (and the Navbar) use `useSelector` / `useDispatch`. Atoms and molecules receive props and callbacks, so they stay reusable and work in Storybook without Redux. |
| **The date is sent in the action** | Reducers must be pure functions, so `new Date()` is called in the page, not in the reducer. |
| **No `useContext`** | Context also shares data, but Redux was chosen for the watchlist because it also gives named actions and Redux Persist. |
| **No `useMemo` / `useCallback`** | The course says they are optimizations for *expensive* calculations. Filtering 20 movies is instant. |
| **The page owns the state** | Chapter 8 rule: atoms and molecules only display and call callbacks, so they stay simple, reusable and easy to test in Storybook. |
| **Only ids in the watchlist** | One single copy of the movie data (`movies.js`); the watchlist only stores the user's information. |
| **Calculated values are not stored in state** | Counts, filtered lists and statistics are calculated from the watchlist on every render, so they can never be out of date. |

### 11. General questions you might be asked

**Why React?** To build the interface from reusable components. The Virtual DOM updates only what changed.
CineTrack is a SPA: the page is loaded once, and React Router changes the screen without reloading.

**What is the difference between props and state?** Props come from the parent and are read-only in the
child. State belongs to the component and can change; when it changes, React re-renders the component.
Example: `ExplorePage` owns the state `search`; `SearchBar` only receives it as the prop `value`.

**What happens when the user clicks the bookmark on a card?** `IconButton` calls `onClick` →
`MovieCard` calls `onToggleWatchlist(movie.id)` → this is the page's `handleToggleWatchlist` →
`dispatch(TOGGLE_WATCHLIST({ movieId, date }))` → the reducer adds the entry to `state.watchlist.items` →
`useSelector` in the page and in the Navbar receives the new list → React re-renders (✓ on the card, count + 1)
→ Redux Persist saves the store in `localStorage`.

**Why Redux and not just `useState`?** The watchlist is needed by every page and by the Navbar. With
`useState` it would have to live in a common parent and be passed down through props everywhere. The store
is available to any component with `useSelector`, and every change is a clear, named action.

**Why does a list need a `key`?** So React can recognise each element between two renders. We use the movie
id, which is unique and never changes.

**What is the difference between `useSelector` and `useDispatch`?** `useSelector` **reads** a value in the
store and re-renders the component when it changes; it never modifies the state. `useDispatch` gives the
`dispatch` function, which **sends an action**; it is the only way to change the store.

**What are the rules of hooks?** Hooks are called at the top level of a function component (or of a custom
hook), never inside a condition or a loop. Their names start with `use`.

**Why `[...movies]` before `.sort()`?** `sort` changes the array it is called on. Copying with the spread
operator (Chapter 1, ES6) protects the original data.
