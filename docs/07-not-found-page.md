# Not found page — any unknown URL

File: [`src/pages/NotFoundPage/NotFoundPage.jsx`](../src/pages/NotFoundPage/NotFoundPage.jsx)

## 1. What the user sees

When the URL does not match any page (for example `/abc` or `/settings`), the app still shows the Navbar
and a message: **"Page not found — The page you are looking for does not exist."** with a **"Go to Home"** button.

## 2. Component tree

```
NotFoundPage (page)
└── MainLayout (template)
    ├── Navbar (organism)   still works, with the watchlist count
    └── EmptyState (molecule)
        └── Button "Go to Home" (atom)
```

## 3. State and data

```js
const navigate = useNavigate();
```

The page has no state and does not read the store: the Navbar inside `MainLayout` reads the watchlist count
from the Redux store by itself.

## 4. Step by step

### The `*` route

In [`AppRouter.jsx`](../src/routes/AppRouter.jsx), the last route is:

```jsx
<Route path="*" element={<NotFoundPage />} />
```

`*` matches **every URL that no other route matches**. This is the "Page 404 avec la route `*`" from Chapter 5.

### The page

```jsx
function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <EmptyState
        icon="🧭"
        title="Page not found"
        message="The page you are looking for does not exist."
        actionLabel="Go to Home"
        onAction={() => navigate("/")}
      />
    </MainLayout>
  );
}
```

It is built like the course's `ErrorPage`: a title, a description and a button that calls `navigate` to
go back home.

### Reusing `EmptyState`

`EmptyState` is the same molecule used for every empty list in the app (empty watchlist, no search result,
no statistics, unknown movie). It receives everything through props:

```jsx
function EmptyState({ icon = "📭", title, message, actionLabel, onAction }) {
  ...
  {message && <p className="empty-state__message">{message}</p>}
  {actionLabel && onAction && (
    <Button variant="primary" onClick={onAction}>{actionLabel}</Button>
  )}
}
```

- `icon = "📭"` is a **default prop value** (Chapter 4): used when the page does not give an icon.
- The message and the button are **optional**: they are shown only if the props are given (`&&`).

## 5. Course concepts used

| Concept | Where | Chapter |
|---|---|---|
| 404 page with the `*` route | `AppRouter.jsx` | Ch. 5 |
| `useNavigate` | "Go to Home" | Ch. 5 |
| Default prop value | `icon = "📭"` in `EmptyState` | Ch. 4 |
| Conditional rendering (`&&`) | optional message and button | Ch. 3 |
| Reusing a molecule | `EmptyState` on 5 screens | Ch. 8 |

## 6. Questions you might be asked

**What is the difference between this page and "Movie not found"?**
This page is for a URL that matches **no route** (`/abc`). "Movie not found" is for a URL that matches the
route `/movies/:movieId` but with an id that does not exist (`/movies/abc`); it is handled inside
`MovieDetailsPage`.

**Why must the `*` route be last?**
React Router chooses the best matching route, so `*` is only used when nothing else matches. Putting it last
in the list also makes the code easier to read.

**How does the Navbar show the right count on this page?**
The Navbar uses `useSelector` to read the count from the Redux store itself. This page does not need to know
about the watchlist at all: that is the advantage of a shared store.
