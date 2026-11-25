# Profile page — `/profile`

File: [`src/pages/ProfilePage/ProfilePage.jsx`](../src/pages/ProfilePage/ProfilePage.jsx)

## 1. What the user sees

The (mock) user's profile and statistics:

- a **profile card**: avatar, name, biography, "Member since…", "Favorite genre: …",
- **Your activity**: In watchlist / Planned / Watched counters,
- **Favorite genres**: a small bar chart of the genres the user watched,
- **Recently watched**: the last 5 movies marked as watched.

If the user has watched nothing yet, the chart and the "Recently watched" section show empty messages.

This screen shows how **every value is calculated from the watchlist**: nothing extra is saved.

## 2. Component tree

```
ProfilePage (page)
└── MainLayout (template)
    ├── Navbar
    ├── ProfileSummary (organism)
    │   ├── UserSummary (molecule)
    │   │   └── Avatar (atom)  image, or initials if the image fails
    │   └── Badge × 2 (atom)  member since, favorite genre
    ├── <section> "Your activity"
    │   └── WatchlistSummary (organism) → StatCard × 3 (molecule)
    ├── <section> "Favorite genres"
    │   └── GenreStatistics (organism)
    │       ├── GenreTag + count + bar, for each genre
    │       └── or EmptyState when there is no data
    └── MovieSection "Recently watched" (organism)
        └── MovieGrid → MovieCard × up to 5
```

## 3. State and data

```js
const { watchlist, getStatus, toggleWatchlist } = useWatchlist();
```

| What | Where it comes from |
|---|---|
| The user | `mockUser` from `data/user.js` (there is no login in CineTrack) |
| The watchlist | `useWatchlist()` |
| Counters, recently watched, genre statistics, favorite genre | **calculated** in the page at every render |

The page has **no `useState`**. If the user marks a movie as watched on another page and comes back here,
all the numbers are recalculated from the saved list.

## 4. Step by step

### 1. The counters and the recently watched movies

```js
const watchedEntries = watchlist.filter((entry) => entry.status === "watched");
const plannedCount = watchlist.length - watchedEntries.length;

// Most recently watched first.
const sortedWatched = [...watchedEntries];
sortedWatched.sort((a, b) => b.watchedAt.localeCompare(a.watchedAt));

const watchedMovies = sortedWatched.map((entry) => getMovieById(entry.movieId));
```

- An entry is either `"planned"` or `"watched"`, so `planned = total − watched`.
- `watchedAt` is a date saved as text (`new Date().toISOString()`), so it can be sorted with `localeCompare`.
- `map` + `getMovieById` turns the ids into full movie objects.
- `watchedMovies.slice(0, 5)` is given to `MovieSection` to show only the last 5.

### 2. Counting the genres — `countGenres`

A helper function written outside the component, in 3 steps:

```js
function countGenres(watchedMovies) {
  // Step 1: use an object as a counter, for example { "Sci-Fi": 3, "Drama": 2 }
  const counts = {};
  watchedMovies.forEach((movie) => {
    movie.genres.forEach((genre) => {
      if (counts[genre]) {
        counts[genre] = counts[genre] + 1;
      } else {
        counts[genre] = 1;
      }
    });
  });

  // Step 2: turn the object into an array so we can sort it and use .map in JSX.
  const result = Object.entries(counts).map(([genre, count]) => {
    return { genre: genre, count: count };
  });

  // Step 3: highest count first. If two genres have the same count, sort A–Z.
  result.sort((a, b) => {
    if (b.count !== a.count) {
      return b.count - a.count;
    }
    return a.genre.localeCompare(b.genre);
  });

  return result;
}
```

Example: Inception (Sci-Fi, Action, Thriller) + The Dark Knight (Action, Crime, Drama) watched →

| Step | Result |
|---|---|
| 1. object counter | `{ "Sci-Fi": 1, "Action": 2, "Thriller": 1, "Crime": 1, "Drama": 1 }` |
| 2. `Object.entries` + `map` | `[{ genre: "Sci-Fi", count: 1 }, { genre: "Action", count: 2 }, ...]` |
| 3. sort | `Action 2, Crime 1, Drama 1, Sci-Fi 1, Thriller 1` |

- `Object.entries` (ES8, Chapter 1) gives `[key, value]` pairs; the `([genre, count])` parameter uses
  **array destructuring**.
- An array (not an object) is needed because JSX displays lists with `map`, and because objects cannot be sorted.

### 3. The favorite genre

```js
let favoriteGenre = "";
if (genreCounts.length > 0) {
  favoriteGenre = genreCounts[0].genre;
}
```

The list is already sorted, so the favorite is simply the first one. `ProfileSummary` shows
"No favorite genre yet" when it receives `""`.

### 4. The bar chart — `GenreStatistics`

```jsx
const highestCount = genreCounts[0].count;
...
{genreCounts.map((item) => {
  const percent = (item.count / highestCount) * 100;
  ...
  <div className="genre-statistics__bar" style={{ width: percent + "%" }} />
})}
```

- The most watched genre gets a 100% bar, the others are proportional.
- The width comes from a calculation, so it is given with an **inline style object** (`style={{ ... }}`, JSX rules, Chapter 3).
- If `genreCounts` is empty, the component returns an `EmptyState` **before** using `genreCounts[0]`
  (early return, conditional rendering).
- "1 movie" / "2 movies": a small `if` chooses the singular or the plural.

### 5. The avatar — `Avatar`

```js
const [hasError, setHasError] = useState(false);
```

If the image is missing or fails (`onError`), the avatar shows the user's initials instead
("Alex Morgan" → "AM", calculated with `split(" ")`).

## 5. Course concepts used

| Concept | Where | Chapter |
|---|---|---|
| Values derived from the state (no extra state) | counters, statistics, favorite genre | Ch. 4 |
| Custom hook | `useWatchlist()` | Ch. 6 |
| `Object.entries`, destructuring, `forEach`, `map`, `filter`, `sort`, spread | `countGenres`, lists | Ch. 1 |
| Inline style object | bar width | Ch. 3 |
| Conditional rendering + early return | `GenreStatistics`, `ProfileSummary`, `Avatar` | Ch. 3 |
| `useState` inside an atom | `Avatar` image fallback | Ch. 4 |
| Organism → molecule → atom composition | `ProfileSummary` → `UserSummary` → `Avatar` | Ch. 8 |
| Reused organisms | `WatchlistSummary` and `MovieSection` also used on other pages | Ch. 8 |

## 6. Questions you might be asked

**Where are the statistics saved?**
Nowhere. They are calculated from the watchlist every time the page renders, so they can never be wrong or
out of date.

**Why convert the `counts` object into an array?**
To sort the genres (objects have no order to sort) and to display them with `map` in JSX.

**What happens when nothing is watched?**
`genreCounts` is `[]`: `GenreStatistics` shows its empty message, the favorite genre is `""` so the badge says
"No favorite genre yet", and `MovieSection` shows "Nothing watched yet".

**Is there a real user account?**
No. `mockUser` is static data in `data/user.js`. The project has no backend and no login.

**Which components are reused from other pages?**
`WatchlistSummary` (also on the Watchlist page) and `MovieSection` (also on Home). This is the goal of
Atomic Design: build once, use everywhere.
