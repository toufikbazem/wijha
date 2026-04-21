import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import userReducer from "../features/auth/userSlice";
import subscriptionReducer from "../features/employers/subscriptionSlice";

const rootReducer = combineReducers({
  user: userReducer,
  subscription: subscriptionReducer,
});

// ensure correct interop if the module resolves as { default: storage }
const persistedStorage = (storage as any)?.default ?? storage;

const persistConfig = {
  key: "root",
  storage: persistedStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
