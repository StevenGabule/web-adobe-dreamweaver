import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { FileNode } from '../../types'
import { createMockFileTree, sortFiles } from '../../utils/fileUtils'
import { v4 as uuidv4 } from 'uuid'

interface FileExplorerState {
  tree: FileNode | null
  selectedPath: string | null
  expandedFolders: string[]
  searchQuery: string
  isLoading: boolean
  error: string | null
  clipboard: {
    operation: 'copy' | 'cut' | null
    path: string | null
  }
  contextMenu: {
    isOpen: boolean
    x: number
    y: number
    targetPath: string | null
  }
}

const initialState: FileExplorerState = {
  tree: createMockFileTree(),
  selectedPath: null,
  expandedFolders: ['/my-website', '/my-website/src'],
  searchQuery: '',
  isLoading: false,
  error: null,
  clipboard: {
    operation: null,
    path: null,
  },
  contextMenu: {
    isOpen: false,
    x: 0,
    y: 0,
    targetPath: null,
  },
}

// Helper to find a node by path
const findNodeByPath = (node: FileNode, path: string): FileNode | null => {
  if (node.path === path) return node
  if (node.children) {
    for (const child of node.children) {
      const found = findNodeByPath(child, path)
      if (found) {
        return found
      }
    }
  }

  return null
}

// Helper to update a node in the tree
const updateNodeInTree = (
  node: FileNode,
  path: string,
  updater: (node: FileNode) => FileNode
): FileNode => {
  if (node.path === path) {
    return updater(node)
  }

  if (node.children) {
    return {
      ...node,
      children: node.children.map((child) => updateNodeInTree(child, path, updater)),
    }
  }
  return node
}

const fileExplorerSlice = createSlice({
  name: 'fileExplorer',
  initialState,
  reducers: {
    // Selection
    selectFile: (state, action: PayloadAction<string | null>) => {
      state.selectedPath = action.payload
    },

    // Expansion
    toggleFolder: (state, action: PayloadAction<string>) => {
      const path = action.payload
      const index = state.expandedFolders.indexOf(path)
      if (index === -1) {
        state.expandedFolders.push(path)
      } else {
        state.expandedFolders.splice(index, 1)
      }
    },

    expandFolder: (state, action: PayloadAction<string>) => {
      if (!state.expandedFolders.includes(action.payload)) {
        state.expandedFolders.push(action.payload)
      }
    },

    collapseFolder: (state, action: PayloadAction<string>) => {
      const index = state.expandedFolders.indexOf(action.payload)
      if (index !== -1) {
        state.expandedFolders.splice(index, 1)
      }
    },

    collapseAll: (state) => {
      state.expandedFolders = []
    },

    expandAll: (state) => {
      if (!state.tree) return

      const collectFolders = (node: FileNode): string[] => {
        const folders: string[] = []
        if (node.type === 'folder') {
          folders.push(node.path)
          if (node.children) {
            node.children.forEach((child) => {
              folders.push(...collectFolders(child))
            })
          }
        }

        return folders
      }

      state.expandedFolders = collectFolders(state.tree)
    },

    // Search
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },

    // File operations
    createFile: (state, action: PayloadAction<{ parentPath: string; name: string }>) => {
      if (!state.tree) return

      const { parentPath, name } = action.payload
      const extension = name.split('.').pop() || ''

      const newFile: FileNode = {
        id: uuidv4(),
        name,
        path: `${parentPath}/${name}`,
        type: 'file',
        extension,
      }

      state.tree = updateNodeInTree(state.tree, parentPath, (node) => ({
        ...node,
        children: sortFiles([...(node.children || []), newFile]),
      }))

      // Ensure parent folder is expanded
      if (!state.expandedFolders.includes(parentPath)) {
        state.expandedFolders.push(parentPath)
      }
    },
    
    createFolder: (state, action: PayloadAction<{ parentPath: string; name: string }>) => {
      if (!state.tree) return

      const { parentPath, name } = action.payload

      const newFolder: FileNode = {
        id: uuidv4(),
        name,
        path: `${parentPath}/${name}`,
        type: 'folder',
        children: [],
      }

      state.tree = updateNodeInTree(state.tree, parentPath, (node) => ({
        ...node,
        children: sortFiles([...(node.children || []), newFolder]),
      }))

      // Ensure parent folder is expanded
      if (!state.expandedFolders.includes(parentPath)) {
        state.expandedFolders.push(parentPath)
      }
    },
    renameNode: (state, action: PayloadAction<{ path: string; newName: string }>) => {
      if (!state.tree) return

      const { path, newName } = action.payload
      const parentPath = path.split('/').slice(0, 1).join('/')
      const newPath = `${parentPath}/${newName}`
      const extension = newName.split('.').pop() || ''

      state.tree = updateNodeInTree(state.tree, path, (node) => ({
        ...node,
        name: newName,
        path: newPath,
        extension: node.type === 'file' ? extension : undefined,
      }))

      // Update selected path if renamed
      if (state.selectedPath === path) {
        state.selectedPath = newPath
      }
    },

    deleteNode: (state, action: PayloadAction<string>) => {
      if (!state.tree) return

      const pathToDelete = action.payload
      const parentPath = pathToDelete.split('/').slice(0, -1).join('/')

      state.tree = updateNodeInTree(state.tree, parentPath, (node) => ({
        ...node,
        children: (node.children || []).filter((child) => child.path !== pathToDelete),
      }))

      // Clear selection if deleted
      if (state.selectedPath === pathToDelete) {
        state.selectedPath = null
      }

      // Remove from expanded folders
      state.expandedFolders = state.expandedFolders.filter((p) => !p.startsWith(pathToDelete))
    },

    // Clipboard
    copyNode: (state, action: PayloadAction<string>) => {
      state.clipboard = {
        operation: 'copy',
        path: action.payload,
      }
    },

    cutNode: (state, action: PayloadAction<string>) => {
      state.clipboard = {
        operation: 'cut',
        path: action.payload,
      }
    },

    clearClipboard: (state) => {
      state.clipboard = {
        operation: null,
        path: null,
      }
    },

    // Context menu
    openContextMenu: (
      state,
      action: PayloadAction<{ x: number; y: number; targetPath: string }>
    ) => {
      state.contextMenu = {
        isOpen: true,
        x: action.payload.x,
        y: action.payload.y,
        targetPath: action.payload.targetPath,
      }
    },

    closeContextMenu: (state) => {
      state.contextMenu = {
        isOpen: false,
        x: 0,
        y: 0,
        targetPath: null,
      }
    },

    // Loading states
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },

    // Reset tree (e.g., when opening new project)
    setTree: (state, action: PayloadAction<FileNode | null>) => {
      state.tree = action.payload
      state.selectedPath = null
      state.expandedFolders = action.payload ? [action.payload.path] : []
    },
  },
})

export const {
  selectFile,
  toggleFolder,
  expandAll,
  expandFolder,
  collapseAll,
  collapseFolder,
  clearClipboard,
  closeContextMenu,
  copyNode,
  createFile,
  createFolder,
  cutNode,
  setError,
  setLoading,
  setSearchQuery,
  setTree,
  openContextMenu,
  deleteNode,
  renameNode,
} = fileExplorerSlice.actions

export default fileExplorerSlice.reducer
