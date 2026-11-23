import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import AppRouter from "./routes/AppRouter";

function App() {
  const location = useLocation();

  // When the URL changes, scroll back to the top of the new page.
  // Without this, opening a movie from the bottom of Home would keep the old scroll position.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return <AppRouter />;
}

export default App;
