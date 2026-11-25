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

There is **no backend**: the movies come from a local JavaScript file and the watchlist is saved in the
browser's `localStorage`, so it is still there after a refresh.

### 2. Tools (all seen in class)

| Tool | Why | Chapter |
|---|---|---|
| **Vite** (`npm create vite@latest -- --template react`) | Creates and runs the React project | Ch. 3 — Installation |
| **React** function components + hooks | The whole interface | Ch. 3, 4, 6 |
| **React Router** (`react-router`) | One URL per screen, navigation without reloading | Ch. 5 |
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
├── hooks/useWatchlist.js    Custom hook: the watchlist and its actions
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

[`main.jsx`](../src/main.jsx) is exactly the structure from the course:

```jsx
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
```

- `createRoot` creates the React root inside `<div id="root">`.
- `StrictMode` helps find problems during development.
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
- It receives `watchlistCount` and passes it to the `Navbar` badge.
- It has one `useEffect` with an **empty dependency array** (Chapter 5, "useEffect au montage"):
  when a new page appears, it runs `window.scrollTo(0, 0)` so the new page starts at the top.

#### `Navbar` (organism) — [`Navbar.jsx`](../src/components/organisms/Navbar/Navbar.jsx)

- Four `NavLink`s: Home, Explore, Watchlist (with the count), Profile.
- `NavLink to="/" end`: `end` means "only active on exactly `/`", otherwise Home would be highlighted on every page.
- **Local state** `isMenuOpen` (`useState(false)`) for the mobile menu. The ☰ button calls `toggleMenu`, which
  does `setIsMenuOpen(!isMenuOpen)`. When the state is `true`, the class `navbar__links--open` is added
  and the CSS shows the links.
- The ☰ button is hidden on screens wider than 768px with a CSS media query.

#### `useWatchlist` (custom hook) — [`useWatchlist.js`](../src/hooks/useWatchlist.js)

The heart of the app. A custom hook is "a function created by the developer, whose name starts with `use`,
that can use other hooks, to reuse logic in several components" (Chapter 6). All six pages need the watchlist
(at least for the Navbar count), so the logic is written once here.

**How it works:**

```js
const [watchlist, setWatchlist] = useState(loadWatchlist());

useEffect(() => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist));
}, [watchlist]);
```

1. `loadWatchlist()` reads the text saved under the key `"cinetrack-watchlist"` and turns it back into an
   array with `JSON.parse`. If nothing is saved, it returns `[]`. A `try/catch` protects against broken
   saved text (the course says: always plan a `try/catch` for errors).
2. That array is the **initial value** of `useState`.
3. `useEffect` with `[watchlist]` as dependency (Chapter 5, "useEffect lors d'une mise à jour"): every
   time the watchlist changes, it is saved again as text with `JSON.stringify`.

**One watchlist entry:**

```js
{ movieId: "inception", status: "planned", addedAt: "2026-11-10T10:00:00.000Z", watchedAt: null }
```

Only the id is saved, never the title or poster: the movie details always come from `data/movies.js`,
so there is a single copy of the movie data.

**Functions returned by the hook:**

| Function | What it does |
|---|---|
| `isInWatchlist(movieId)` | `true` if the movie is saved |
| `getStatus(movieId)` | `"none"`, `"planned"` or `"watched"` |
| `addToWatchlist(movieId)` | Adds a `"planned"` entry (does nothing if already saved: no duplicates) |
| `removeFromWatchlist(movieId)` | Keeps every entry except this one (`filter`) |
| `markAsWatched(movieId)` | Changes the status to `"watched"` (`map` + spread); adds it if missing |
| `markAsPlanned(movieId)` | Changes the status back to `"planned"` |
| `toggleWatchlist(movieId)` | Add if missing, remove if saved (used by the bookmark buttons) |

**Immutability:** the state is never changed directly. Every function builds a **new array**
(`[...watchlist, newEntry]`, `filter`, `map` with `{ ...item, status: "watched" }`) and gives it to
`setWatchlist`. React sees a new array, so it re-renders. This is the same rule as the reducers in
Chapter 7: "return a new state without modifying the old one".

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
| `Navbar` | Organism | `watchlistCount` | MainLayout |
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
| **Each page calls `useWatchlist()`** | Only one page is visible at a time. When a page appears, its `useState` reads the latest saved list from `localStorage`, so every page is always up to date. |
| **`localStorage` instead of Redux Toolkit + Redux Persist** | Redux (Chapter 7) is the course tool for shared, saved state. For one small list, a custom hook with `useState` + `useEffect` does the same job with about 15 lines and no extra library. |
| **No `useContext`** | Context avoids passing props through many levels. Here the page passes the data at most 3 levels down, which stays easy to read. |
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
`MovieCard` calls `onToggleWatchlist(movie.id)` → this is the `toggleWatchlist` function of the page's
`useWatchlist` → `setWatchlist(newArray)` → React re-renders the page with the new list → the `useEffect`
saves it in `localStorage`.

**Why does a list need a `key`?** So React can recognise each element between two renders. We use the movie
id, which is unique and never changes.

**What are the rules of hooks?** Hooks are called at the top level of a function component (or of a custom
hook), never inside a condition or a loop. Their names start with `use`.

**Why `[...movies]` before `.sort()`?** `sort` changes the array it is called on. Copying with the spread
operator (Chapter 1, ES6) protects the original data.
