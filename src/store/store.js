import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
// "es/storage" is the ES-module version of "lib/storage" (localStorage).
// Vite needs this version: with "lib/storage" the app crashes with "storage.getItem is not a function".
import storage from "redux-persist/es/storage";
import watchlistReducer from "../features/watchlistSlice";

// All the parts (slices) of the store. CineTrack only has one: the watchlist.
const rootReducer = combineReducers({
  watchlist: watchlistReducer,
});

// Redux Persist: save the store in localStorage so the watchlist
// is still there after a page refresh.
// whitelist: the parts of the store that are saved.
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
