import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface DevicePreset {
  id: string
  name: string
  width: number
  height: number
  type: 'mobile' | 'tablet' | 'desktop'
}

interface ConsoleMessage {
  id: string
  type: 'log' | 'warn' | 'error' | 'info'
  message: string
  timestamp: number
}

interface PreviewState {
  isEnabled: boolean
  isPanelVisible: boolean
  viewportSize: {
    width: number
    height: number
  }
  selectedDevice: DevicePreset | null
  zoom: number
  showDeviceFrame: boolean
  autoRefresh: boolean
  refreshKey: number
  consoleMessages: ConsoleMessage[]
  showConsole: boolean
  isLoading: boolean
  splitPosition: number
}

export const devicePresets: DevicePreset[] = [
  { id: 'iphone-se', name: 'iPhone SE', width: 375, height: 667, type: 'mobile' },
  { id: 'iphone-14', name: 'iPhone 14', width: 390, height: 844, type: 'mobile' },
  { id: 'iphone-14-pro-max', name: 'iPhone 14 Pro Max', width: 430, height: 932, type: 'mobile' },
  { id: 'pixel-7', name: 'Pixel 7', width: 412, height: 915, type: 'mobile' },
  { id: 'samsung-s21', name: 'Samsung S21', width: 360, height: 800, type: 'mobile' },
  { id: 'ipad-mini', name: 'iPad Mini', width: 768, height: 1024, type: 'tablet' },
  { id: 'ipad-pro-11', name: 'iPad Pro 11"', width: 834, height: 1194, type: 'tablet' },
  { id: 'ipad-pro-12', name: 'iPad Pro 12.9"', width: 1024, height: 1366, type: 'tablet' },
  { id: 'surface-pro', name: 'Surface Pro 7', width: 912, height: 1368, type: 'tablet' },
  { id: 'laptop', name: 'Laptop', width: 1366, height: 768, type: 'desktop' },
  { id: 'desktop-hd', name: 'Desktop HD', width: 1920, height: 1080, type: 'desktop' },
  { id: 'desktop-2k', name: 'Desktop 2K', width: 2560, height: 1440, type: 'desktop' },
]

const initialState: PreviewState = {
  isEnabled: true,
  isPanelVisible: false,
  viewportSize: {
    width: 1024,
    height: 768,
  },
  selectedDevice: null,
  zoom: 100,
  showDeviceFrame: true,
  autoRefresh: true,
  refreshKey: 0,
  consoleMessages: [],
  showConsole: false,
  isLoading: false,
  splitPosition: 50,
}

const previewSlice = createSlice({
  name: 'preview',
  initialState,
  reducers: {
    togglePreview: (state) => {
      state.isPanelVisible = !state.isPanelVisible
    },
    showPreview: (state) => {
      state.isPanelVisible = true
    },
    hidePreview: (state) => {
      state.isPanelVisible = false
    },
    setViewportSize: (state, action: PayloadAction<{ width: number; height: number }>) => {
      state.viewportSize = action.payload
      state.selectedDevice = null
    },
    selectDevice: (state, action: PayloadAction<DevicePreset | null>) => {
      state.selectedDevice = action.payload
      if (action.payload) {
        state.viewportSize = {
          width: action.payload.width,
          height: action.payload.height,
        }
      }
    },
    setZoom: (state, action: PayloadAction<number>) => {
      state.zoom = Math.max(25, Math.min(200, action.payload))
    },
    zoomIn: (state) => {
      state.zoom = Math.min(200, state.zoom + 25)
    },

    zoomOut: (state) => {
      state.zoom = Math.max(25, state.zoom - 25)
    },
    setZoomIn: (state) => {
      state.zoom = Math.min(200, state.zoom + 25)
    },
    setZoomOut: (state) => {
      state.zoom = Math.max(25, state.zoom - 25)
    },
    resetZoom: (state) => {
      state.zoom = 100
    },
    toggleDeviceFrame: (state) => {
      state.showDeviceFrame = !state.showDeviceFrame
    },
    toggleAutoRefresh: (state) => {
      state.autoRefresh = !state.autoRefresh
    },
    refresh: (state) => {
      state.refreshKey += 1
    },
    addConsoleMessage: (state, action: PayloadAction<Omit<ConsoleMessage, 'id' | 'timestamp'>>) => {
      state.consoleMessages.push({
        ...action.payload,
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
      })

      // Keep only last 100 messages
      if (state.consoleMessages.length > 100) {
        state.consoleMessages = state.consoleMessages.slice(-100)
      }
    },
    clearConsole: (state) => {
      state.consoleMessages = []
    },
    toggleConsole: (state) => {
      state.showConsole = !state.showConsole
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setSplitPosition: (state, action: PayloadAction<number>) => {
      state.splitPosition = Math.max(20, Math.min(80, action.payload))
    },
    rotateDevice: (state) => {
      const { width, height } = state.viewportSize
      state.viewportSize = { width: height, height: width }
    },
  },
})

export const {
  togglePreview,
  showPreview,
  hidePreview,
  setViewportSize,
  selectDevice,
  setZoom,
  zoomIn,
  zoomOut,
  setZoomIn,
  setZoomOut,
  resetZoom,
  toggleDeviceFrame,
  toggleAutoRefresh,
  refresh,
  addConsoleMessage,
  clearConsole,
  toggleConsole,
  setLoading,
  setSplitPosition,
  rotateDevice,
} = previewSlice.actions

export default previewSlice.reducer
