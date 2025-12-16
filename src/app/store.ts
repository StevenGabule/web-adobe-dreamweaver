import { configureStore } from '@reduxjs/toolkit'
import editorReducer from '../features/editor/editorSlice'
import fileExplorerReducer from '../features/fileExplorer/fileExplorerSlice'
import projectReducer from '../features/project/projectSlice'
import workspaceReducer from '../features/workspace/workspaceSlice'
import cssDesignerReducer from '../features/cssDesigner/cssDesignerSlice'

export const store = configureStore({
  reducer: {
    editor: editorReducer,
    fileExplorer: fileExplorerReducer,
    project: projectReducer,
    workspace: workspaceReducer,
    cssDesigner: cssDesignerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serialization checks
        ignoredActions: ['editor/setViewState'],

        // Ignore these paths in the state
        ignoredPaths: ['editor.openFiles'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
