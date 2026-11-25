# Explore page — `/explore`

File: [`src/pages/ExplorePage/ExplorePage.jsx`](../src/pages/ExplorePage/ExplorePage.jsx)

## 1. What the user sees

The full catalog with three tools that **work together**:

- a **search field** (search by title, with a ✕ button to clear it),
- a **Genre** dropdown ("All genres", "Action", "Drama"…),
- a **Sort by** dropdown (rating, release year, title A–Z),
- a **Clear filters** button and the text "*n* movies found".

If nothing matches, an empty message appears with a "Clear filters" button.

This is the screen that best shows **controlled inputs** and **state owned by the page**.

## 2. Component tree

```
ExplorePage (page)  ← owns the state: search, selectedGenre, sortBy
└── CatalogLayout (template)   title + filters area + results area
    └── MainLayout (template)
        ├── Navbar
        ├── filters = FilterPanel (organism)
        │   ├── SearchBar (molecule)
        │   │   ├── Input (atom)
        │   │   └── IconButton ✕ (atom, only when there is text)
        │   ├── Select "Genre" (atom)
        │   ├── Select "Sort by" (atom)
        │   ├── Button "Clear filters" (atom)
        │   └── <p> "n movies found"
        └── children = MovieGrid (organism)
            ├── MovieCard × n (molecule)
            └── or EmptyState (molecule) when the list is empty
```

`CatalogLayout` receives **two pieces of JSX**: the `FilterPanel` through a prop called `filters`, and
the `MovieGrid` through `children`. A prop can contain a component (Chapter 4).

## 3. State and data

```js
const [search, setSearch] = useState("");
const [selectedGenre, setSelectedGenre] = useState("all");
const [sortBy, setSortBy] = useState("rating");
const { watchlist, toggleWatchlist, getStatus } = useWatchlist();
```

| State | Initial value | Changed by |
|---|---|---|
| `search` | `""` | typing in the search field, the ✕ button |
| `selectedGenre` | `"all"` | the Genre dropdown |
| `sortBy` | `"rating"` | the Sort by dropdown |

The **filtered list is not stored in state**: it is calculated from the three states at every render.
It can never be out of date, and there is only one source of truth.

## 4. Step by step

### The filtering, in 3 steps

```js
// 1. Search: keep movies whose title contains the text (upper/lower case ignored).
const searchText = search.trim().toLowerCase();
let filteredMovies = movies.filter((movie) => movie.title.toLowerCase().includes(searchText));

// 2. Genre: keep only movies that have the selected genre.
if (selectedGenre !== "all") {
  filteredMovies = filteredMovies.filter((movie) => movie.genres.includes(selectedGenre));
}

// 3. Sort what is left.
filteredMovies = sortMovies(filteredMovies, sortBy);
```

- `trim()` removes spaces at the start and the end, `toLowerCase()` makes "DARK" and "dark" equal.
- `includes` (ES7, Chapter 1) is used twice: "does the title contain the text?" and "does the genres array
  contain the selected genre?".
- An empty search `""` is contained in every title, so with no text every movie is kept.

`sortMovies` is a small helper written **outside** the component:

```js
function sortMovies(list, sortBy) {
  const sorted = [...list];
  if (sortBy === "rating") {
    sorted.sort((a, b) => b.rating - a.rating);       // highest first
  } else if (sortBy === "year") {
    sorted.sort((a, b) => b.year - a.year);           // newest first
  } else if (sortBy === "title") {
    sorted.sort((a, b) => a.title.localeCompare(b.title)); // A–Z
  }
  return sorted;
}
```

### The user types "dark" in the search field

1. `Input` is a **controlled input**: its `value` comes from the page and every change goes back through `onChange`.
2. `SearchBar` receives the event and sends only the text up:

   ```js
   function handleInputChange(event) {
     onChange(event.target.value);
   }
   ```

3. `onChange` is `onSearchChange` from `FilterPanel`, which is `setSearch` from the page.
4. `search` becomes `"dark"` → React re-renders `ExplorePage` → the 3 filtering steps run again →
   `MovieGrid` receives 1 movie → the counter shows "1 movie found".
5. Because `value !== ""`, `SearchBar` now shows the ✕ button:

   ```jsx
   {value !== "" && (
     <div className="search-bar__clear">
       <IconButton icon="✕" label="Clear search" onClick={handleClear} />
     </div>
   )}
   ```

   `handleClear` calls `onChange("")`, so the search becomes empty again.

**The props go down, the callbacks go up** (Chapter 8):

```
ExplorePage ── search, onSearchChange={setSearch} ──► FilterPanel ── value, onChange ──► SearchBar ──► Input
     ▲                                                                                                │
     └──────────────────────────── setSearch("dark") ◄──────── onChange("dark") ◄──── user types ─────┘
```

### The user chooses a genre or a sort

`Select` gives the change event; `FilterPanel` reads the value and calls the page function:

```jsx
onChange={(event) => onGenreChange(event.target.value)}
```

`FilterPanel` builds the genre options from the list received in props, with "All genres" first:

```js
const genreOptions = [{ value: "all", label: "All genres" }];
genres.forEach((genre) => {
  genreOptions.push({ value: genre, label: genre });
});
```

The genre list comes from `getAllGenres()`, called **once** outside the component because the catalog
never changes.

### The user clicks "Clear filters"

```js
function clearFilters() {
  setSearch("");
  setSelectedGenre("all");
  setSortBy("rating");
}
```

The same function is used by the "Clear filters" button **and** by the button of the empty message
(`onEmptyAction={clearFilters}`).

### Singular or plural

```jsx
{resultCount === 1 ? "1 movie found" : resultCount + " movies found"}
```

A ternary operator (conditional rendering, Chapter 3).

## 5. Course concepts used

| Concept | Where | Chapter |
|---|---|---|
| `useState` × 3 | search, genre, sort | Ch. 4, 6 |
| Controlled input (`value` + `onChange`) | `Input`, `Select` | Ch. 4, 8 |
| Callbacks passed as props | `onSearchChange`, `onGenreChange`, `onSortChange`, `onClear` | Ch. 1 (callbacks), Ch. 8 |
| Page owns the state, atoms only display | `ExplorePage` → `FilterPanel` → `SearchBar` → `Input` | Ch. 8 |
| A component passed as a prop + `children` | `CatalogLayout filters={...}` | Ch. 4 |
| Conditional rendering (`&&`, ternary) | ✕ button, counter, empty message | Ch. 3 |
| `filter`, `includes`, `sort`, spread | filtering | Ch. 1 |

## 6. Questions you might be asked

**Why is the state in `ExplorePage` and not in `FilterPanel`?**
`FilterPanel` and `MovieGrid` both need the values: `FilterPanel` to show them, the grid to know which
movies to display. The state must be in their common parent, the page. This also follows the Chapter 8
rule: the page owns the state, the organisms only display and call callbacks.

**Why isn't `filteredMovies` a state?**
It can be calculated from `search`, `selectedGenre` and `sortBy`. Storing it would create a second copy that
could become different from the real filters.

**Why not `useMemo` for the filtering?**
The course presents `useMemo` as an optimization for expensive calculations. Filtering 20 movies is
instant, so it is not needed.

**Why does `SearchBar` send `event.target.value` and not the event?**
So the page can give `setSearch` directly: `setSearch` expects a text, not an event. The ✕ button can then
call the same `onChange("")`.

**Why copy the array in `sortMovies`?**
`sort` modifies the array. Without the copy we could change the array that came from the filter (and, with no
filter, the catalog itself).
