# Home page — `/`

File: [`src/pages/HomePage/HomePage.jsx`](../src/pages/HomePage/HomePage.jsx)

## 1. What the user sees

The first screen of the app. It helps the user discover movies:

- A big **featured movie banner** (Inception) with a "View details" button and an "Add to watchlist" button.
- Three sections of 5 movies: **Trending now**, **Top rated**, **Recently added**, each with a "See all →" link to Explore.
- At the bottom, an **"Explore all movies"** button.

On every movie card, the round **+** button adds the movie to the watchlist (it becomes **✓**).

## 2. Component tree

```
HomePage (page)
└── MainLayout (template)
    ├── Navbar (organism)
    ├── HeroBanner (organism)
    │   ├── Badge "Featured" (atom)
    │   ├── MovieMetadata (molecule) → Rating (atom)
    │   ├── GenreTag × n (molecule) → Badge (atom)
    │   └── Button × 2 (atom)
    ├── MovieSection "Trending now" (organism)
    │   └── MovieGrid (organism)
    │       └── MovieCard × 5 (molecule)
    │           ├── Poster, Badge, IconButton (atoms)
    │           └── MovieMetadata, GenreTag (molecules)
    ├── MovieSection "Top rated"
    ├── MovieSection "Recently added"
    └── <section> + Button "Explore all movies"
```

## 3. State and data

| What | Where it comes from |
|---|---|
| The catalog | `movies` imported from `data/movies.js` |
| The watchlist | The Redux store: `useSelector((state) => state.watchlist.items)` |
| Changing the watchlist | `useDispatch()` + the action `TOGGLE_WATCHLIST` |
| Navigation | `useNavigate()` from React Router |

The page has **no `useState` of its own**: the only data that changes is the watchlist, and it lives in
the Redux store.

### The movie lists are calculated once, outside the component

```js
const SECTION_SIZE = 5;

let featuredMovie = movies.find((movie) => movie.isFeatured);
if (featuredMovie === undefined) {
  featuredMovie = movies[0];
}

const trendingMovies = movies.filter((movie) => movie.isTrending).slice(0, SECTION_SIZE);

const topRatedMovies = [...movies];
topRatedMovies.sort((a, b) => b.rating - a.rating);

const recentMovies = [...movies];
recentMovies.sort((a, b) => b.addedAt.localeCompare(a.addedAt));
```

- These lists depend only on the catalog, which never changes, so they are written **outside** the
  function `HomePage`. They are calculated one time when the file is loaded, not at every render.
- `featuredMovie`: the first movie with `isFeatured: true`. If none is found, we take the first movie,
  so the banner can never crash.
- `[...movies]` copies the array before `sort`, because `sort` changes the array it is called on
  (spread operator, Chapter 1).
- `b.rating - a.rating` sorts from the highest rating to the lowest.
- The `addedAt` dates are written like `"2026-11-01"`, so they can be compared as text with `localeCompare`.

## 4. Step by step

### Rendering

```jsx
function HomePage() {
  const navigate = useNavigate();
  const watchlist = useSelector((state) => state.watchlist.items);
  const dispatch = useDispatch();

  function getMovieStatus(movieId) {
    return getStatus(watchlist, movieId);
  }

  function handleToggleWatchlist(movieId) {
    dispatch(TOGGLE_WATCHLIST({ movieId: movieId, date: new Date().toISOString() }));
  }

  return (
    <MainLayout>
      <HeroBanner
        movie={featuredMovie}
        isInWatchlist={getMovieStatus(featuredMovie.id) !== "none"}
        onViewDetails={() => navigate("/movies/" + featuredMovie.id)}
        onToggleWatchlist={handleToggleWatchlist}
      />
      <MovieSection
        title="Trending now"
        ...
        movies={trendingMovies}
        getStatus={getMovieStatus}
        onToggleWatchlist={handleToggleWatchlist}
      />
      ...
```

- `useSelector` **reads** the watchlist from the store; `useDispatch` gives the `dispatch` function that
  **sends actions** (Chapter 7).
- `getMovieStatus` and `handleToggleWatchlist` are two small functions of the page. The page passes them as
  props (`getStatus`, `onToggleWatchlist`): the organisms do not know about Redux, they just call what they
  receive (Chapter 8).

### The user clicks "+ Add to watchlist" in the banner

1. In `HeroBanner`, the button runs `onClick={() => onToggleWatchlist(movie.id)}`.
2. `onToggleWatchlist` is the page's `handleToggleWatchlist`, which sends the action
   `dispatch(TOGGLE_WATCHLIST({ movieId: "inception", date: "..." }))`.
3. In the slice, the `TOGGLE_WATCHLIST` reducer does not find the movie, so it adds a `"planned"` entry
   to `state.items`.
4. `useSelector` gives the page the new list, React re-renders `HomePage`:
   `getMovieStatus(featuredMovie.id) !== "none"` is now `true`.
5. `HeroBanner` receives `isInWatchlist={true}` and changes its label:

   ```js
   let watchlistLabel = "+ Add to watchlist";
   if (isInWatchlist) {
     watchlistLabel = "✓ In your watchlist";
   }
   ```

6. The Navbar also uses `useSelector`, so its count goes from 0 to 1 by itself. Redux Persist saves the
   new store in `localStorage`.

### The user clicks the + on a movie card

The function is passed down as a prop through every level: `HomePage` → `MovieSection` → `MovieGrid` → `MovieCard` → `IconButton`.
`MovieGrid` also calls `getStatus(movie.id)` (the page's `getMovieStatus`) for each card and passes the result as the prop `status`, which
decides the icon (+ or ✓), the style (`active`) and the "Planned"/"Watched" badge.

### The user clicks "View details" or "Explore all movies"

`navigate("/movies/inception")` or `navigate("/explore")` changes the URL without reloading the page.
React Router then shows the matching page.

## 5. Course concepts used

| Concept | Where | Chapter |
|---|---|---|
| Function component, JSX | `HomePage` | Ch. 3 |
| Props (data **and** functions) | `HeroBanner`, `MovieSection` | Ch. 3–4 |
| Redux: `useSelector`, `useDispatch`, action `TOGGLE_WATCHLIST` | the watchlist | Ch. 7 |
| `useNavigate` | buttons | Ch. 5 |
| `<Link>` | "See all →" in `MovieSection` | Ch. 5 |
| Conditional rendering (`&&`) | `MovieSection` shows the link only if `actionLabel && actionTo` | Ch. 3 |
| Lists with `map` + `key` | `MovieGrid`, genres in `HeroBanner` | Ch. 3–5 |
| `filter`, `find`, `sort`, spread, destructuring | movie lists | Ch. 1 |
| Atomic Design + `children` | `MainLayout` | Ch. 4, 8 |

## 6. Questions you might be asked

**Why are `trendingMovies`, `topRatedMovies`… outside the component?**
Because they only depend on the catalog, which never changes. Inside the component they would be calculated
again at every render for nothing. Putting them outside is simpler than using `useMemo`.

**Why `slice(0, SECTION_SIZE)`?**
To show only the first 5 movies of each list. The constant `SECTION_SIZE` avoids writing `5` in several places.

**Why does `HeroBanner` receive `isInWatchlist` instead of using `useSelector` itself?**
Chapter 8: the page gets the data, organisms only display props. This way `HeroBanner` can be shown in
Storybook with `isInWatchlist: true` or `false` without any Redux store.

**Why is the date created in the page and not in the reducer?**
A reducer must be a pure function (Chapter 7). `new Date()` returns a different value each time, so it is
created in `handleToggleWatchlist` and sent inside the action.

**What happens if no movie has `isFeatured: true`?**
`find` returns `undefined`, so the `if` uses `movies[0]` instead. The banner always has a movie.
