import { useEffect, useState } from "react";

// Reads a saved value from localStorage.
// If nothing is saved, or the saved text is not valid JSON, it returns initialValue.
function readSavedValue(key, initialValue) {
  try {
    const savedText = window.localStorage.getItem(key);
    if (savedText === null) {
      return initialValue;
    }
    return JSON.parse(savedText);
  } catch (error) {
    // JSON.parse fails on broken data, and localStorage can be blocked by the browser.
    console.warn("Could not read '" + key + "' from localStorage.", error);
    return initialValue;
  }
}

// Custom hook: works like useState, but the value is also saved in localStorage,
// so it is still there after a page refresh.
// It is generic: it knows nothing about movies.
//
// Usage: const [value, setValue] = useLocalStorage("my-key", []);
export function useLocalStorage(key, initialValue) {
  // Passing a function to useState means it only runs once, on the first render,
  // instead of reading localStorage again on every render.
  const [value, setValue] = useState(() => readSavedValue(key, initialValue));

  // Every time the value changes, save it as JSON text.
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn("Could not save '" + key + "' to localStorage.", error);
    }
  }, [key, value]);

  return [value, setValue];
}
