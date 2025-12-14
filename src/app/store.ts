import { configureStore } from "@reduxjs/toolkit";
import editorReducer from "../features/editor/editorSlice";

export const store = configureStore({
  reducer: {
    editor: editorReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serialization checks
        ignoredActions: ["editor/setViewState"],

        // Ignore these paths in the state
        ignoredPaths: ["editor.openFiles"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
