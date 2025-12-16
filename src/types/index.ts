// FILE SYSTEM TYPES
export interface FileNode {
  id: string
  name: string
  path: string
  type: 'file' | 'folder'
  children?: FileNode[]
  isExpanded?: boolean
  extension?: string
  size?: number
  lastModified?: number
}

export interface CursorPosition {
  line: number
  column: number
}

// EDITOR TYPES
export interface OpenFile {
  id: string
  path: string
  filename: string
  language: string
  content: string
  originalContent: string
  isDirty: boolean
  cursorPosition: CursorPosition
  scrollPosition: number
  viewState?: unknown
}

export interface EditorSettings {
  theme: 'vs-dark' | 'vs-light' | 'hc-black'
  fontSize: number
  fontFamily: string
  tabSize: number
  wordWrap: 'on' | 'off' | 'wordWrapColumn' | 'bounded'
  minimap: boolean
  lineNumbers: 'on' | 'off' | 'relative'
  renderWhitespace: 'none' | 'boundary' | 'selection' | 'trailing' | 'all'
  formatOnSave: boolean
  formatOnPaste: boolean
  autoSave: 'off' | 'afterDelay' | 'onFocusChange'
  autoSaveDelay: number
}

// PROJECT TYPES
export interface ProjectSettings {
  localServerPort: number
  outputFolder: string
  excludePatterns: string[]
}

export interface Project {
  id: string
  name: string
  rootPath: string
  createdAt: string
  lastOpenedAt: string
  settings: ProjectSettings
}

// Workspace Types
export type PanelId =
  | 'fileExplorer'
  | 'editor'
  | 'preview'
  | 'cssDesigner'
  | 'properties'
  | 'terminal'
  | 'output'

export interface PanelState {
  id: PanelId
  isVisible: boolean
  size?: number
}

export interface WorkspaceLayout {
  id: string
  name: string
  panels: PanelState[]
}

// UI Types
export interface ContextMenuItem {
  id: string
  label: string
  icon?: React.ReactNode
  shortcut?: string
  disabled?: boolean
  danger?: boolean
  separator?: boolean
  onClick?: () => void
  children?: ContextMenuItem[]
}

export interface ToastMessage {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  message: string
  duration?: number
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export interface AsyncState<T> {
  data: T | null
  isLoading: boolean
  error: string | null
}
