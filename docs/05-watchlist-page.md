# Watchlist page — `/watchlist`

File: [`src/pages/WatchlistPage/WatchlistPage.jsx`](../src/pages/WatchlistPage/WatchlistPage.jsx)

## 1. What the user sees

The movies the user saved:

- three **counters**: In watchlist / Planned / Watched,
- three **filter buttons**: All / Planned / Watched (the selected one is highlighted),
- the movie grid, where each card has **action buttons**: *Mark watched* or *Move to planned*, and *Remove*.

Two different empty messages:

- the watchlist is completely empty → "Your watchlist is empty" + "Explore movies" button,
- the watchlist has movies, but none match the filter → "No planned movies" / "No watched movies yet" + "Show all" button.

## 2. Component tree

```
WatchlistPage (page)  ← owns the state: statusFilter
└── MainLayout (template)
    ├── Navbar
    ├── <header> "My Watchlist"
    ├── WatchlistSummary (organism)
    │   └── StatCard × 3 (molecule)
    └── watchlist empty?
        ├── yes → EmptyState (molecule) + Button
        └── no  → <section>
                  ├── Button × 3 (atom)  All / Planned / Watched
                  └── MovieGrid (organism)
                      ├── MovieCard × n (molecule) with action Buttons
                      └── or EmptyState when the filter gives nothing
```

## 3. State and data

```js
const navigate = useNavigate();
const watchlist = useSelector((state) => state.watchlist.items);
const dispatch = useDispatch();
const [statusFilter, setStatusFilter] = useState("all");
```

| What | Type | Where |
|---|---|---|
| `watchlist` | shared, saved data | Redux store, read with `useSelector` |
| `statusFilter` | local screen state (`"all"`, `"planned"`, `"watched"`) | `useState` in the page |
| `plannedCount`, `watchedCount`, `visibleMovies`, empty texts | **calculated** at every render | in the page |

The filter is a **local state** (it only matters on this screen and does not need to be saved), while
the watchlist is **shared and saved**. This is the difference the course makes between local state and
shared state.

## 4. Step by step

### The counters

```js
const plannedCount = watchlist.filter((entry) => entry.status === "planned").length;
const watchedCount = watchlist.filter((entry) => entry.status === "watched").length;
```

`WatchlistSummary` only receives three numbers and displays three `StatCard`s.

### Building the visible list, in 3 steps

```js
// 1. Keep only the entries that match the selected status filter.
let visibleEntries = watchlist;
if (statusFilter !== "all") {
  visibleEntries = watchlist.filter((entry) => entry.status === statusFilter);
}

// 2. Show the most recently added movies first.
const sortedEntries = [...visibleEntries];
sortedEntries.sort((a, b) => b.addedAt.localeCompare(a.addedAt));

// 3. Turn each entry into the full movie object from the catalog.
const visibleMovies = sortedEntries.map((entry) => getMovieById(entry.movieId));
```

Step 3 is important: the watchlist only stores ids, so `map` + `getMovieById` gets the full movie
(title, poster, genres…) from the catalog.

### The filter buttons

```js
const statusFilters = [
  { value: "all", label: "All" },
  { value: "planned", label: "Planned" },
  { value: "watched", label: "Watched" },
];
```

```jsx
{statusFilters.map((filter) => (
  <Button
    key={filter.value}
    size="small"
    variant={statusFilter === filter.value ? "primary" : "secondary"}
    onClick={() => setStatusFilter(filter.value)}
  >
    {filter.label}
  </Button>
))}
```

- The buttons are generated from an array with `map`, instead of writing three almost identical buttons.
- The ternary chooses the style: the selected filter is `"primary"`, the others `"secondary"`.
- Clicking calls `setStatusFilter`, React re-renders and the 3 steps above run again.

### Two levels of empty message

```jsx
{watchlist.length === 0 ? (
  <EmptyState title="Your watchlist is empty" ... onAction={() => navigate("/explore")} />
) : (
  <section> ... <MovieGrid ... /> </section>
)}
```

- Ternary rendering (Chapter 3): either the big empty message, or the filters + grid.
- If the watchlist is not empty but the filter gives nothing, it is `MovieGrid` that shows its own
  `EmptyState`. The page prepares the right text before:

  ```js
  let emptyTitle = "No planned movies";
  let emptyMessage = "Every movie in your watchlist has been watched. Nice work!";
  if (statusFilter === "watched") {
    emptyTitle = "No watched movies yet";
    emptyMessage = "Mark a planned movie as watched and it will appear here.";
  }
  ```

  and passes `onEmptyAction={() => setStatusFilter("all")}` for the "Show all" button.

### The action buttons on the cards

The page writes three small handlers, one per Redux action:

```js
function handleMarkWatched(movieId) {
  dispatch(MARK_AS_WATCHED({ movieId: movieId, date: new Date().toISOString() }));
}

function handleMarkPlanned(movieId) {
  dispatch(MARK_AS_PLANNED(movieId));
}

function handleRemove(movieId) {
  dispatch(REMOVE_FROM_WATCHLIST(movieId));
}
```

and gives them to `MovieGrid`, which passes them to every `MovieCard`:

```jsx
<MovieGrid
  movies={visibleMovies}
  getStatus={getMovieStatus}
  onMarkWatched={handleMarkWatched}
  onMarkPlanned={handleMarkPlanned}
  onRemove={handleRemove}
  ...
/>
```

`MovieCard` only shows a button if it received the matching callback **and** the status allows it:

```jsx
{status === "planned" && onMarkWatched && (
  <Button size="small" onClick={() => onMarkWatched(movie.id)}>Mark watched</Button>
)}
{status === "watched" && onMarkPlanned && (
  <Button size="small" variant="secondary" onClick={() => onMarkPlanned(movie.id)}>Move to planned</Button>
)}
{onRemove && (
  <Button size="small" variant="danger" onClick={() => onRemove(movie.id)}>Remove</Button>
)}
```

That is why the **same `MovieCard`** shows a + bookmark on Home/Explore (it receives `onToggleWatchlist`) and
action buttons on the Watchlist page (it receives the 3 other callbacks). The component is reused, only the
props change.

### The user clicks "Remove"

1. `MovieCard` calls `onRemove(movie.id)` → the page's `handleRemove` →
   `dispatch(REMOVE_FROM_WATCHLIST(movieId))`.
2. The reducer keeps every entry except this one:
   `state.items = state.items.filter((item) => item.movieId !== action.payload);`
3. `useSelector` gives the new list to the page and to the Navbar → the card disappears, the counters and
   the Navbar badge change.
4. Redux Persist saves the store in `localStorage`.

## 5. Course concepts used

| Concept | Where | Chapter |
|---|---|---|
| Local `useState` vs shared Redux store | `statusFilter` vs `state.watchlist` | Ch. 4, 7 |
| `useDispatch` + 3 actions | the card buttons | Ch. 7 |
| Lists generated with `map` + `key` | filter buttons, grid | Ch. 3–5 |
| Conditional rendering (ternary, `&&`) | empty messages, card buttons | Ch. 3 |
| Callbacks passed down 2 levels | page → `MovieGrid` → `MovieCard` | Ch. 8 |
| Optional props | `MovieCard` shows buttons only for the callbacks it receives | Ch. 4 |
| `filter`, `sort`, spread, `map` | counters and visible list | Ch. 1 |
| `useNavigate` | "Explore movies" | Ch. 5 |

## 6. Questions you might be asked

**Why is `statusFilter` a `useState` and not in the Redux store like the watchlist?**
It is only a display choice for this screen: no other component needs it and it does not need to be saved.
When the user comes back, starting on "All" is normal. Only shared data (the watchlist) goes in the store.

**Why `[...visibleEntries]` before sorting?**
When the filter is "All", `visibleEntries` **is** the `watchlist` array from the Redux store. The store can
only be changed by a reducer (through `dispatch`); Redux Toolkit even freezes this array, so sorting it
directly would throw an error.

**How does the same `MovieCard` show different buttons on different pages?**
The card checks which callbacks it receives. On Home it only gets `onToggleWatchlist`, on this page it gets
`onMarkWatched`, `onMarkPlanned` and `onRemove`. Optional props make the component reusable.

**Why two different empty messages?**
They mean two different things: "you have saved nothing" (go and explore) or "nothing matches this filter"
(show all). Each one proposes the useful action.
