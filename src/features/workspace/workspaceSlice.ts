import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'
import type { PanelId, PanelState, WorkspaceLayout } from '../../types'

interface WorkspaceState {
  // Panel visibility
  panels: Record<PanelId, PanelState>

  // Layout
  sidebarWidth: number
  panelHeight: number

  // Theme
  theme: 'dark' | 'light'

  // Saved layouts
  savedLayouts: WorkspaceLayout[]
  activeLayoutId: string | null

  // UI State
  isSidebarCollapsed: boolean
  isPanelCollapsed: boolean
  focusedPanelId: PanelId | null

  // Activity bar
  activeActivityItem: 'explorer' | 'search' | 'git' | 'extensions' | 'settings'
}

const initialState: WorkspaceState = {
  panels: {
    fileExplorer: { id: 'fileExplorer', isVisible: true, size: 250 },
    editor: { id: 'editor', isVisible: true },
    preview: { id: 'preview', isVisible: false },
    cssDesigner: { id: 'cssDesigner', isVisible: false, size: 300 },
    properties: { id: 'properties', isVisible: false, size: 250 },
    terminal: { id: 'terminal', isVisible: false, size: 200 },
    output: { id: 'output', isVisible: false, size: 250 },
  },
  sidebarWidth: 250,
  panelHeight: 200,
  theme: 'dark',
  savedLayouts: [],
  activeLayoutId: null,
  isSidebarCollapsed: false,
  isPanelCollapsed: true,
  focusedPanelId: null,
  activeActivityItem: 'explorer',
}

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    // Panel visibility
    togglePanel: (state, action: PayloadAction<PanelId>) => {
      const panel = state.panels[action.payload]
      if (panel) {
        panel.isVisible = !panel.isVisible
      }
    },

    showPanel: (state, action: PayloadAction<PanelId>) => {
      const panel = state.panels[action.payload]
      if (panel) {
        panel.isVisible = true
      }
    },

    hidePanel: (state, action: PayloadAction<PanelId>) => {
      const panel = state.panels[action.payload]
      if (panel) {
        panel.isVisible = false
      }
    },

    // Panel Sizing
    setPanelSize: (state, action: PayloadAction<{ panelId: PanelId; size: number }>) => {
      const panel = state.panels[action.payload.panelId]
      if (panel) {
        panel.size = action.payload.size
      }
    },

    setSidebarWidth: (state, action: PayloadAction<number>) => {
      state.sidebarWidth = action.payload
    },

    setPanelHeight: (state, action: PayloadAction<number>) => {
      state.panelHeight = action.payload
    },

    // Collapse/expand
    toggleSidebar: (state) => {
      state.isSidebarCollapsed = !state.isSidebarCollapsed
    },

    collapseSidebar: (state) => {
      state.isSidebarCollapsed = true
    },

    expandSidebar: (state) => {
      state.isSidebarCollapsed = false
    },

    toggleBottomPanel: (state) => {
      state.isPanelCollapsed = !state.isPanelCollapsed
    },

    // Focus
    setFocusedPanel: (state, action: PayloadAction<PanelId | null>) => {
      state.focusedPanelId = action.payload
    },

    // Activity bar
    setActiveActivityItem: (state, action: PayloadAction<WorkspaceState['activeActivityItem']>) => {
      state.activeActivityItem = action.payload

      // show sidebar when activity item is clicked
      state.isSidebarCollapsed = false
    },

    // Theme
    setTheme: (state, action: PayloadAction<'dark' | 'light'>) => {
      state.theme = action.payload
    },

    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark'
    },

    // Layout management
    saveLayout: (state, action: PayloadAction<string>) => {
      const layout: WorkspaceLayout = {
        id: uuidv4(),
        name: action.payload,
        panels: Object.values(state.panels),
      }
      state.savedLayouts.push(layout)
    },

    loadLayout: (state, action: PayloadAction<string>) => {
      const layout = state.savedLayouts.find((l) => l.id === action.payload)
      if (layout) {
        layout.panels.forEach((panelState) => {
          state.panels[panelState.id] = panelState
        })

        state.activeLayoutId = layout.id
      }
    },

    deleteLayout: (state, action: PayloadAction<string>) => {
      state.savedLayouts = state.savedLayouts.filter((l) => l.id !== action.payload)

      if (state.activeLayoutId === action.payload) {
        state.activeLayoutId = null
      }
    },

    // Preset layouts
    applyCoderLayout: (state) => {
      state.panels.fileExplorer.isVisible = true
      state.panels.editor.isVisible = true
      state.panels.preview.isVisible = false
      state.panels.cssDesigner.isVisible = false
      state.panels.properties.isVisible = false
      state.panels.terminal.isVisible = true
      state.isSidebarCollapsed = false
      state.isPanelCollapsed = false
    },

    applyDesignerLayout: (state) => {
      state.panels.fileExplorer.isVisible = true
      state.panels.editor.isVisible = true
      state.panels.preview.isVisible = true
      state.panels.cssDesigner.isVisible = true
      state.panels.properties.isVisible = true
      state.panels.terminal.isVisible = false
      state.isSidebarCollapsed = false
      state.isPanelCollapsed = true
    },

    applySplitLayout: (state) => {
      state.panels.fileExplorer.isVisible = true
      state.panels.editor.isVisible = true
      state.panels.preview.isVisible = true
      state.panels.cssDesigner.isVisible = false
      state.panels.properties.isVisible = true
      state.panels.terminal.isVisible = false
      state.isSidebarCollapsed = false
      state.isPanelCollapsed = true
    },

    applyMinimalLayout: (state) => {
      state.panels.fileExplorer.isVisible = false
      state.panels.editor.isVisible = true
      state.panels.preview.isVisible = false
      state.panels.cssDesigner.isVisible = false
      state.panels.properties.isVisible = false
      state.panels.terminal.isVisible = false
      state.isSidebarCollapsed = true
      state.isPanelCollapsed = true
    },

    resetLayout: (state) => {
      state.panels = initialState.panels
      state.sidebarWidth = initialState.sidebarWidth
      state.panelHeight = initialState.panelHeight
      state.isSidebarCollapsed = initialState.isSidebarCollapsed
      state.isPanelCollapsed = initialState.isPanelCollapsed
      state.activeLayoutId = null
    },
  },
})

export const {
  togglePanel,
  showPanel,
  hidePanel,
  setPanelSize,
  setSidebarWidth,
  setPanelHeight,
  toggleBottomPanel,
  toggleSidebar,
  toggleTheme,
  resetLayout,
  applyCoderLayout,
  applyDesignerLayout,
  applyMinimalLayout,
  applySplitLayout,
  deleteLayout,
  loadLayout,
  saveLayout,
  setActiveActivityItem,
  setFocusedPanel,
  setTheme,
  expandSidebar,
  collapseSidebar,
} = workspaceSlice.actions

export default workspaceSlice.reducer
