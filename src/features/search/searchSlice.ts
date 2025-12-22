import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

interface SearchMatch {
  fileId: string
  filePath: string
  filename: string
  line: number
  column: number
  length: number
  matchText: string
  lineContent: string
  lineContentBefore: string
  lineContentAfter: string
}

interface SearchState {
  // Panel Visibility
  isOpen: boolean
  activeTab: 'find' | 'replace' | 'findInFiles'

  // Search query
  searchQuery: string
  replaceQuery: string

  // Options
  caseSensitive: boolean
  wholeWord: boolean
  useRegex: boolean
  preserveCase: boolean

  // File filters (for project search)
  includePattern: string
  excludePattern: string

  // Results
  matches: SearchMatch[]
  currentMatchIndex: number
  totalMatches: number

  // In-file search state
  fileMatches: {
    fileId: string
    matches: Array<{
      line: number
      column: number
      length: number
    }>
  } | null

  // State
  isSearching: boolean
  searchError: string | null

  // History
  searchHistory: string[]
  replaceHistory: string[]
}

const initialState: SearchState = {
  isOpen: false,
  activeTab: 'find',

  searchQuery: '',
  replaceQuery: '',

  caseSensitive: false,
  wholeWord: false,
  useRegex: false,
  preserveCase: false,

  includePattern: '',
  excludePattern: 'node_modules, .git, dist',

  matches: [],
  currentMatchIndex: -1,
  totalMatches: 0,

  fileMatches: null,

  isSearching: false,
  searchError: null,

  searchHistory: [],
  replaceHistory: [],
}

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    // Panel
    openSearch: (state) => {
      state.isOpen = true
    },
    closeSearch: (state) => {
      state.isOpen = false
    },
    toggleSearch: (state) => {
      state.isOpen = !state.isOpen
    },
    setActiveTab: (state, action: PayloadAction<SearchState['activeTab']>) => {
      state.activeTab = action.payload
    },

    // Query
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
      state.currentMatchIndex = -1
    },

    setReplaceQuery: (state, action: PayloadAction<string>) => {
      state.replaceQuery = action.payload
    },

    // Options
    toggleCaseSensitive: (state) => {
      state.caseSensitive = !state.caseSensitive
    },
    toggleWholeWord: (state) => {
      state.wholeWord = !state.wholeWord
    },
    toggleRegex: (state) => {
      state.useRegex = !state.useRegex
    },
    togglePreserveCase: (state) => {
      state.preserveCase = !state.preserveCase
    },

    // Filters
    setIncludePattern: (state, action: PayloadAction<string>) => {
      state.includePattern = action.payload
    },
    setExcludePattern: (state, action: PayloadAction<string>) => {
      state.excludePattern = action.payload
    },

    // Results
    setMatches: (state, action: PayloadAction<SearchMatch[]>) => {
      state.matches = action.payload
      state.totalMatches = action.payload.length
      state.currentMatchIndex = action.payload.length > 0 ? 0 : -1
      state.isSearching = false
    },

    setFileMatches: (state, action: PayloadAction<SearchState['fileMatches']>) => {
      state.fileMatches = action.payload
      state.totalMatches = action.payload?.matches.length || 0
      state.currentMatchIndex = action.payload?.matches.length ? 0 : -1
    },
    clearMatches: (state) => {
      state.matches = []
      state.fileMatches = null
      state.totalMatches = 0
      state.currentMatchIndex = -1
    },

    // Navigation
    nextMatch: (state) => {
      if (state.totalMatches > 0) {
        state.currentMatchIndex = (state.currentMatchIndex + 1) % state.totalMatches
      }
    },

    previousMatch: (state) => {
      if (state.totalMatches > 0) {
        state.currentMatchIndex =
          (state.currentMatchIndex - 1 + state.totalMatches) % state.totalMatches
      }
    },

    goToMatch: (state, action: PayloadAction<number>) => {
      if (action.payload >= 0 && action.payload < state.totalMatches) {
        state.currentMatchIndex = action.payload
      }
    },

    // State
    setSearching: (state, action: PayloadAction<boolean>) => {
      state.isSearching = action.payload
    },

    setSearchError: (state, action: PayloadAction<string | null>) => {
      state.searchError = action.payload
    },

    // History
    addToSearchHistory: (state, action: PayloadAction<string>) => {
      const query = action.payload.trim()
      if (query && !state.searchHistory.includes(query)) {
        state.searchHistory = [query, ...state.searchHistory].slice(0, 20)
      }
    },

    addToReplaceHistory: (state, action: PayloadAction<string>) => {
      const query = action.payload.trim()
      if (query && !state.replaceHistory.includes(query)) {
        state.replaceHistory = [query, ...state.replaceHistory].slice(0, 20)
      }
    },

    clearHistory: (state) => {
      state.searchHistory = []
      state.replaceHistory = []
    },

    // Reset
    resetSearch: (state) => {
      state.searchQuery = ''
      state.replaceQuery = ''
      state.matches = []
      state.fileMatches = null
      state.totalMatches = 0
      state.currentMatchIndex = -1
      state.searchError = null
    },
  },
})

export const {
  openSearch,
  closeSearch,
  toggleSearch,
  setActiveTab,
  setSearchQuery,
  setReplaceQuery,
  toggleCaseSensitive,
  toggleWholeWord,
  toggleRegex,
  togglePreserveCase,
  setIncludePattern,
  setExcludePattern,
  setMatches,
  setFileMatches,
  clearMatches,
  nextMatch,
  previousMatch,
  goToMatch,
  setSearching,
  setSearchError,
  addToSearchHistory,
  addToReplaceHistory,
  clearHistory,
  resetSearch,
} = searchSlice.actions

export default searchSlice.reducer
