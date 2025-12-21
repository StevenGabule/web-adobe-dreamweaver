import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { CursorPosition, EditorSettings, OpenFile } from '../../types'
import { getFilenameFromPath, getLanguageFromPath, getMockFileContent } from '../../utils/fileUtils'
import { v4 as uuidv4 } from 'uuid'

interface EditorState {
  openFiles: OpenFile[]
  activeFileId: string | null
  splitMode: 'none' | 'horizontal' | 'vertical'
  secondaryActiveFileId: string | null
  settings: EditorSettings
  isUnsavedDialogOpen: boolean
  pendingCloseFileId: string | null
}

const defaultSettings: EditorSettings = {
  theme: 'vs-dark',
  fontSize: 14,
  fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
  tabSize: 2,
  wordWrap: 'on',
  minimap: true,
  lineNumbers: 'on',
  renderWhitespace: 'selection',
  formatOnSave: true,
  formatOnPaste: true,
  autoSave: 'off',
  autoSaveDelay: 1000,
}

const initialState: EditorState = {
  openFiles: [],
  activeFileId: null,
  splitMode: 'none',
  secondaryActiveFileId: null,
  settings: defaultSettings,
  isUnsavedDialogOpen: false,
  pendingCloseFileId: null,
}

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    // Open a file in the editor
    openFile: (state, action: PayloadAction<{ path: string }>) => {
      const { path } = action.payload

      // Check if file is already open
      const existingFile = state.openFiles.find((f) => f.path === path)
      if (existingFile) {
        state.activeFileId = existingFile.id
        return
      }

      // Create new open file
      const content = getMockFileContent(path)
      const newFile: OpenFile = {
        id: uuidv4(),
        path,
        filename: getFilenameFromPath(path),
        language: getLanguageFromPath(path),
        content,
        originalContent: content,
        isDirty: false,
        cursorPosition: { line: 1, column: 1 },
        scrollPosition: 0,
      }

      state.openFiles.push(newFile)
      state.activeFileId = newFile.id
    },

    // Close a file
    closeFile: (state, action: PayloadAction<string>) => {
      const fileId = action.payload
      const fileIndex = state.openFiles.findIndex((f) => f.id === fileId)

      if (fileIndex === -1) return

      const file = state.openFiles[fileIndex]

      // If file is dirty, show confirmation dialog
      if (file.isDirty) {
        state.isUnsavedDialogOpen = true
        state.pendingCloseFileId = fileId
        return
      }

      // Remove the file
      state.openFiles.splice(fileIndex, 1)

      // Update active file if necessary
      if (state.activeFileId === fileId) {
        if (state.openFiles.length > 0) {
          // Activate the previous tab or the first one
          const newIndex = Math.min(fileIndex, state.openFiles.length - 1)
          state.activeFileId = state.openFiles[newIndex].id
        } else {
          state.activeFileId = null
        }
      }

      // Update secondary active file if necessary
      if (state.secondaryActiveFileId === fileId) {
        state.secondaryActiveFileId = null
      }
    },

    // Force close a file (skip dirty check)
    forceCloseFile: (state, action: PayloadAction<string>) => {
      const fileId = action.payload
      const fileIndex = state.openFiles.findIndex((f) => f.id === fileId)

      if (fileIndex === -1) return

      state.openFiles.splice(fileIndex, 1)

      if (state.activeFileId === fileId) {
        if (state.openFiles.length > 0) {
          const newIndex = Math.min(fileIndex, state.openFiles.length - 1)
          state.activeFileId = state.openFiles[newIndex].id
        } else {
          state.activeFileId = null
        }
      }

      if (state.secondaryActiveFileId === fileId) {
        state.secondaryActiveFileId = null
      }

      state.isUnsavedDialogOpen = false
      state.pendingCloseFileId = null
    },

    // Close all files
    closeAllFiles: (state) => {
      const hasDirtyFiles = state.openFiles.some((f) => f.isDirty)
      if (hasDirtyFiles) {
        state.isUnsavedDialogOpen = true
        state.pendingCloseFileId = 'all'
        return
      }

      state.openFiles = []
      state.activeFileId = null
      state.secondaryActiveFileId = null
    },

    // Close other files (keep only the specified file)
    closeOtherFiles: (state, action: PayloadAction<string>) => {
      const fileId = action.payload
      const fileToKeep = state.openFiles.find((f) => f.id === fileId)
      if (!fileToKeep) return

      const otherDirtyFiles = state.openFiles.filter((f) => f.id !== fileId && f.isDirty)
      if (otherDirtyFiles.length > 0) {
        // For simplicity, we'll just prevent closing if there are dirty files
        return
      }

      state.openFiles = [fileToKeep]
      state.activeFileId = fileId
      state.secondaryActiveFileId = null
    },

    // Set active file
    setActiveFile: (state, action: PayloadAction<string>) => {
      const file = state.openFiles.find((f) => f.id === action.payload)
      if (file) {
        state.activeFileId = action.payload
      }
    },

    // Update file content
    updateFileContent: (state, action: PayloadAction<{ fileId: string; content: string }>) => {
      const { fileId, content } = action.payload
      const file = state.openFiles.find((f) => f.id === fileId)
      if (file) {
        file.content = content
        file.isDirty = content !== file.originalContent
      }
    },

    // Save File
    saveFile: (state, action: PayloadAction<string>) => {
      const file = state.openFiles.find((f) => f.id === action.payload)
      if (file) {
        file.originalContent = file.content
        file.isDirty = false
      }
    },

    // Save all files
    saveAllFiles: (state) => {
      state.openFiles.forEach((file) => {
        file.originalContent = file.content
        file.isDirty = false
      })
    },

    // Revert file to original content
    revertFile: (state, action: PayloadAction<string>) => {
      const file = state.openFiles.find((f) => f.id === action.payload)
      if (file) {
        file.content = file.originalContent
        file.isDirty = false
      }
    },

    // Update cursor position
    updateCursorPosition: (
      state,
      action: PayloadAction<{ fileId: string; position: CursorPosition }>
    ) => {
      const { fileId, position } = action.payload
      const file = state.openFiles.find((f) => f.id === fileId)
      if (file) {
        file.cursorPosition = position
      }
    },

    // Update scroll position
    updateScrollPosition: (state, action: PayloadAction<{ fileId: string; scrollTop: number }>) => {
      const { fileId, scrollTop } = action.payload
      const file = state.openFiles.find((f) => f.id === fileId)
      if (file) {
        file.scrollPosition = scrollTop
      }
    },

    // Store monaco view state
    setViewState: (state, action: PayloadAction<{ fileId: string; viewState: unknown }>) => {
      const { fileId, viewState } = action.payload
      const file = state.openFiles.find((f) => f.id === fileId)
      if (file) {
        file.viewState = viewState
      }
    },

    // Reorder tabs
    reorderTabs: (state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) => {
      const { fromIndex, toIndex } = action.payload
      const [removed] = state.openFiles.splice(fromIndex, 1)
      state.openFiles.splice(toIndex, 0, removed)
    },

    // Split view
    setSplitMode: (state, action: PayloadAction<'none' | 'horizontal' | 'vertical'>) => {
      state.splitMode = action.payload
      if (action.payload === 'none') {
        state.secondaryActiveFileId = null
      }
    },

    setSecondaryActiveFile: (state, action: PayloadAction<string | null>) => {
      state.secondaryActiveFileId = action.payload
    },

    // Setting
    updateSettings: (state, action: PayloadAction<Partial<EditorSettings>>) => {
      state.settings = { ...state.settings, ...action.payload }
    },

    // Dialog control
    closeUnsavedDialog: (state) => {
      state.isUnsavedDialogOpen = false
      state.pendingCloseFileId = null
    },

    // Handle file rename (update open file path)
    handleFileRename: (state, action: PayloadAction<{ oldPath: string; newPath: string }>) => {
      const { oldPath, newPath } = action.payload
      const file = state.openFiles.find((f) => f.path === oldPath)
      if (file) {
        file.path = newPath
        file.filename = getFilenameFromPath(newPath)
        file.language = getLanguageFromPath(newPath)
      }
    },

    // Handle file delete (close if open)
    handleFileDelete: (state, action: PayloadAction<string>) => {
      const deletedPath = action.payload
      const file = state.openFiles.find((f) => f.path === deletedPath)
      if (file) {
        const fileIndex = state.openFiles.indexOf(file)
        state.openFiles.splice(fileIndex, 1)

        if (state.activeFileId === file.id) {
          if (state.openFiles.length > 0) {
            const newIndex = Math.min(fileIndex, state.openFiles.length - 1)
            state.activeFileId = state.openFiles[newIndex].id
          } else {
            state.activeFileId = null
          }
        }
      }
    },
  },
})

export const {
  openFile,
  closeFile,
  forceCloseFile,
  closeAllFiles,
  closeOtherFiles,
  closeUnsavedDialog,
  setActiveFile,
  updateFileContent,
  saveFile,
  saveAllFiles,
  revertFile,
  updateCursorPosition,
  updateScrollPosition,
  updateSettings,
  setViewState,
  reorderTabs,
  setSplitMode,
  setSecondaryActiveFile,
  handleFileDelete,
  handleFileRename,
} = editorSlice.actions

export default editorSlice.reducer
