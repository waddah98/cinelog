# Movie details page — `/movies/:movieId`

File: [`src/pages/MovieDetailsPage/MovieDetailsPage.jsx`](../src/pages/MovieDetailsPage/MovieDetailsPage.jsx)

## 1. What the user sees

Everything about one movie:

- a "← Back to Explore" link,
- the backdrop image, the poster, the title, year / duration / rating, the genres,
- **"Your status"**: *Not in your watchlist*, *Planned* or *Watched*,
- **action buttons that change with the status**,
- the overview, the director and the cast.

If the id in the URL does not exist (for example `/movies/abc`), a **"Movie not found"** message appears
with a "Browse all movies" button.

This screen shows the **dynamic route** and **conditional rendering** from the course.

## 2. Component tree

```
MovieDetailsPage (page)
└── MainLayout (template)
    ├── Navbar
    ├── Link "← Back to Explore"
    └── <article>
        ├── Poster (atom)  backdrop, 16/9
        ├── Poster (atom)  poster, 2/3
        ├── MovieMetadata (molecule) → Rating (atom)
        ├── GenreTag × n (molecule)
        ├── Badge (atom)  the status
        ├── Button × 2 or 3 (atom)  depending on the status
        └── sections Overview / Director / Cast (cast with map + key)

When the id is unknown:
MovieDetailsPage → MainLayout → EmptyState (molecule) → Button (atom)
```

## 3. State and data

```js
const { movieId } = useParams();
const navigate = useNavigate();
const watchlist = useSelector((state) => state.watchlist.items);
const dispatch = useDispatch();

const movie = getMovieById(movieId);
```

| What | Where it comes from |
|---|---|
| `movieId` | The URL, read with `useParams()`. `/movies/inception` → `"inception"` |
| `movie` | `getMovieById(movieId)` in `data/movies.js` (uses `find`, returns `undefined` if not found) |
| `watchlist` | The Redux store, read with `useSelector` |
| `status` | `getStatus(watchlist, movie.id)` from the slice file: `"none"`, `"planned"` or `"watched"` |
| Actions | 4 Redux actions sent with `dispatch`: `ADD_TO_WATCHLIST`, `MARK_AS_WATCHED`, `MARK_AS_PLANNED`, `REMOVE_FROM_WATCHLIST` |

The page has no `useState` of its own: everything is derived from the URL and the watchlist.

## 4. Step by step

### 1. Reading the URL

The route is declared in `AppRouter.jsx` with a parameter:

```jsx
<Route path="/movies/:movieId" element={<MovieDetailsPage />} />
```

The `:` means "this part of the URL changes". One page component works for all 20 movies.

### 2. Protection against a wrong id (early return)

```jsx
if (movie === undefined) {
  return (
    <MainLayout>
      <EmptyState
        icon="🎬"
        title="Movie not found"
        message={"We could not find a movie with the id \"" + movieId + "\"."}
        actionLabel="Browse all movies"
        onAction={() => navigate("/explore")}
      />
    </MainLayout>
  );
}
```

Conditional rendering with `if` (Chapter 3): without this, `movie.title` would crash the app on
`undefined`. The hooks are all called **before** this `if`, because hooks must always be called in the same
order (rules of hooks).

### 3. Choosing the status badge

```js
let statusBadge = <Badge>Not in your watchlist</Badge>;
if (status === "planned") {
  statusBadge = <Badge variant="planned">Planned</Badge>;
}
if (status === "watched") {
  statusBadge = <Badge variant="watched">Watched</Badge>;
}
```

JSX is a JavaScript value, so it can be stored in a variable and displayed later with `{statusBadge}`.

### 4. Buttons that depend on the status

Each button calls a small handler that **dispatches** a Redux action:

```js
function handleAdd() {
  dispatch(ADD_TO_WATCHLIST({ movieId: movie.id, date: new Date().toISOString() }));
}

function handleMarkWatched() {
  dispatch(MARK_AS_WATCHED({ movieId: movie.id, date: new Date().toISOString() }));
}

function handleMarkPlanned() {
  dispatch(MARK_AS_PLANNED(movie.id));
}

function handleRemove() {
  dispatch(REMOVE_FROM_WATCHLIST(movie.id));
}
```

```jsx
{status === "none" && (
  <Button onClick={handleAdd}>Add to watchlist</Button>
)}
{status !== "watched" && (
  <Button variant={status === "none" ? "secondary" : "primary"} onClick={handleMarkWatched}>
    Mark as watched
  </Button>
)}
{status === "watched" && (
  <Button variant="secondary" onClick={handleMarkPlanned}>Move back to planned</Button>
)}
{status !== "none" && (
  <Button variant="danger" onClick={handleRemove}>Remove from watchlist</Button>
)}
```

| Status | Buttons shown |
|---|---|
| `none` | Add to watchlist · Mark as watched |
| `planned` | Mark as watched · Remove from watchlist |
| `watched` | Move back to planned · Remove from watchlist |

"Mark as watched" also works when the movie is not saved yet: the `MARK_AS_WATCHED` reducer adds it
directly as `"watched"`.

### 5. The user clicks "Mark as watched"

1. `handleMarkWatched` runs `dispatch(MARK_AS_WATCHED({ movieId: "inception", date: "..." }))`.
2. In the slice, the `MARK_AS_WATCHED` reducer finds the entry and changes it:
   `entry.status = "watched"; entry.watchedAt = action.payload.date;`
   (Redux Toolkit turns this into a new state, the old one is not modified).
3. `useSelector` gives the page the new list → React re-renders → `status` is now `"watched"` → the badge
   and the buttons change.
4. Redux Persist saves the store in `localStorage`.

### 6. Images that fail to load

`Poster` keeps a small state:

```js
const [hasError, setHasError] = useState(false);
...
<img ... onError={() => setHasError(true)} />
```

If the image file is missing, the browser triggers `onError`, the state becomes `true`, and the component
shows a 🎬 box with the movie title instead.

### 7. The cast list

```jsx
{movie.cast.map((actor) => (
  <li key={actor}>{actor}</li>
))}
```

`map` turns the array into `<li>` elements; the actor name is the `key` because it is unique in the list.

## 5. Course concepts used

| Concept | Where | Chapter |
|---|---|---|
| Dynamic route `:movieId` + `useParams` | URL → movie | Ch. 5 |
| `<Link>`, `useNavigate` | back link, "Browse all movies" | Ch. 5 |
| Conditional rendering (`if`, `&&`, ternary) | not found, badge, buttons | Ch. 3 |
| `useState` in an atom | `Poster` error fallback | Ch. 4 |
| Event props (`onClick`, `onError`) | buttons, images | Ch. 3–4 |
| Redux: `useSelector`, `useDispatch`, 4 actions | watchlist status and buttons | Ch. 7 |
| Reducer of a slice | `MARK_AS_WATCHED` in `watchlistSlice.js` | Ch. 7 |
| Lists with `map` + `key` | genres, cast | Ch. 3–5 |

## 6. Questions you might be asked

**How does one component show 20 different movies?**
The route `/movies/:movieId` has a parameter. `useParams()` reads it from the URL and `getMovieById` finds
the matching movie in the catalog.

**What happens with a wrong URL like `/movies/abc`?**
`getMovieById("abc")` returns `undefined`, so the page returns the "Movie not found" message instead of
crashing. A completely unknown URL like `/abc` goes to the `*` route (Not found page).

**Why are the hooks called before the `if (movie === undefined)`?**
Rules of hooks: they must be called at the top level, always in the same order. A `return` before a hook
would skip it on some renders.

**Why doesn't the page store `status` in a state?**
It can be calculated from the watchlist with `getStatus`. When the store changes, `useSelector` gives the
new watchlist and the status is automatically correct at the next render.

**What does `dispatch(MARK_AS_PLANNED(movie.id))` send?**
`MARK_AS_PLANNED(movie.id)` is an action creator made by `createSlice`. It returns the object
`{ type: "WATCHLIST/MARK_AS_PLANNED", payload: "inception" }`, and `dispatch` sends it to the store.
