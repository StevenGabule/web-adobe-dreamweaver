import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Project, ProjectSettings } from '../../types'
import { v4 as uuidv4 } from 'uuid'

interface ProjectState {
  currentProject: Project | null
  recentProjects: Project[]
  isLoading: boolean
  error: string | null
}

const mockProject: Project = {
  id: uuidv4(),
  name: 'my-website',
  rootPath: '/my-website',
  createdAt: new Date().toISOString(),
  lastOpenedAt: new Date().toISOString(),
  settings: {
    localServerPort: 3000,
    outputFolder: 'dist',
    excludePatterns: ['node_modules', '.git', 'dist'],
  },
}

const initialState: ProjectState = {
  currentProject: mockProject,
  recentProjects: [mockProject],
  isLoading: false,
  error: null,
}

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    // Open a project
    openProject: (state, action: PayloadAction<Project>) => {
      state.currentProject = action.payload
      state.currentProject.lastOpenedAt = new Date().toISOString()

      // Add to recent projects or update if exists
      const existingIndex = state.recentProjects.findIndex((p) => p.id === action.payload.id)

      if (existingIndex !== -1) {
        state.recentProjects[existingIndex] = action.payload
      } else {
        state.recentProjects.unshift(action.payload)

        // Keep only last 10 recent projects
        if (state.recentProjects.length > 10) {
          state.recentProjects.pop()
        }
      }
    },

    closeProject: (state) => {
      state.currentProject = null
    },

    // Create new project
    createProject: (state, action: PayloadAction<{ name: string; rootPath: string }>) => {
      const newProject: Project = {
        id: uuidv4(),
        name: action.payload.name,
        rootPath: action.payload.rootPath,
        createdAt: new Date().toISOString(),
        lastOpenedAt: new Date().toISOString(),
        settings: {
          localServerPort: 3000,
          outputFolder: 'dist',
          excludePatterns: ['node_modules', '.git', 'dist'],
        },
      }

      state.currentProject = newProject
      state.recentProjects.unshift(newProject)
    },

    // Update project settings
    updateProjectSettings: (state, action: PayloadAction<Partial<ProjectSettings>>) => {
      if (state.currentProject) {
        state.currentProject.settings = {
          ...state.currentProject.settings,
          ...action.payload,
        }
      }
    },

    // Rename project
    renameProject: (state, action: PayloadAction<string>) => {
      if (state.currentProject) {
        state.currentProject.name = action.payload
      }
    },

    // Remove from recent projects
    removeFromRecentProjects: (state, action: PayloadAction<string>) => {
      state.recentProjects = state.recentProjects.filter((p) => p.id !== action.payload)
    },

    // Clear recent projecs
    clearRecentProjects: (state) => {
      state.recentProjects = state.currentProject ? [state.currentProject] : []
    },

    // Loading states
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const {
  openProject,
  closeProject,
  createProject,
  updateProjectSettings,
  renameProject,
  removeFromRecentProjects,
  clearRecentProjects,
  setLoading,
  setError,
} = projectSlice.actions

export default projectSlice.reducer
