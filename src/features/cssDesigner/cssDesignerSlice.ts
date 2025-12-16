import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface CSSProperty {
  name: string
  value: string
  isImportant?: boolean
}

interface CSSRule {
  selector: string
  properties: CSSProperty[]
  source?: string
  line?: number
}

interface BoxModelValues {
  marginTop: string
  marginRight: string
  marginBottom: string
  marginLeft: string
  paddingTop: string
  paddingRight: string
  paddingBottom: string
  paddingLeft: string
  borderTopWidth: string
  borderRightWidth: string
  borderBottomWidth: string
  borderLeftWidth: string
  width: string
  height: string
}

interface CSSDesignerState {
  isVisible: boolean

  // Selected element info
  selectedElement: {
    tagName: string
    id: string
    classes: string[]
    path: string
  } | null

  // Current Styles
  computedStyles: Record<string, string>
  inlineStyles: Record<string, string>
  matchedRules: CSSRule[]

  // Active editing
  activeSection: 'layout' | 'typography' | 'background' | 'effects' | 'position' | 'all'
  activeSelector: string | null

  // Box model
  boxModel: BoxModelValues

  // UI State
  showComputed: boolean
  colorFormat: 'hex' | 'rgb' | 'hsl'

  // CSS output
  generatedCSS: string
}

const defaultBoxModel: BoxModelValues = {
  marginBottom: '0',
  marginTop: '0',
  marginLeft: '0',
  marginRight: '0',
  paddingTop: '0',
  paddingBottom: '0',
  paddingRight: '0',
  paddingLeft: '0',
  borderTopWidth: '0',
  borderRightWidth: '0',
  borderBottomWidth: '0',
  borderLeftWidth: '0',
  width: '0',
  height: '0',
}

const initialState: CSSDesignerState = {
  isVisible: false,
  selectedElement: null,
  computedStyles: {},
  inlineStyles: {},
  matchedRules: [],
  activeSection: 'layout',
  activeSelector: null,
  boxModel: defaultBoxModel,
  showComputed: false,
  colorFormat: 'hex',
  generatedCSS: '',
}

// Common CSS properties by category
export const cssCategories = {
  layout: [
    'display',
    'position',
    'top',
    'right',
    'bottom',
    'left',
    'z-index',
    'float',
    'clear',
    'overflow',
    'overflow-x',
    'overflow-y',
    'flex-direction',
    'flex-wrap',
    'justify-content',
    'align-items',
    'align-content',
    'gap',
    'grid-template-columns',
    'grid-template-rows',
  ],
  typography: [
    'font-family',
    'font-size',
    'font-weight',
    'font-style',
    'line-height',
    'letter-spacing',
    'word-spacing',
    'text-align',
    'text-decoration',
    'text-transform',
    'text-indent',
    'white-space',
    'color',
  ],
  background: [
    'background-color',
    'background-image',
    'background-repeat',
    'background-position',
    'background-size',
    'background-attachment',
  ],
  border: [
    'border-width',
    'border-style',
    'border-color',
    'border-radius',
    'border-top-width',
    'border-right-width',
    'border-bottom-width',
    'border-left-width',
    'border-top-left-radius',
    'border-top-right-radius',
    'border-bottom-right-radius',
    'border-bottom-left-radius',
    'outline',
  ],
  effects: [
    'opacity',
    'box-shadow',
    'text-shadow',
    'filter',
    'backdrop-filter',
    'mix-blend-mode',
    'transform',
    'transition',
    'animation',
  ],
  position: [
    'width',
    'height',
    'min-width',
    'max-width',
    'min-height',
    'max-height',
    'margin',
    'margin-top',
    'margin-right',
    'margin-bottom',
    'margin-left',
    'padding',
    'padding-top',
    'padding-right',
    'padding-bottom',
    'padding-left',
  ],
}

// Display options
export const displayOptions = [
  'block',
  'inline',
  'inline-block',
  'flex',
  'inline-flex',
  'grid',
  'inline-grid',
  'none',
  'contents',
]

// Position options
export const positionOptions = ['static', 'relative', 'absolute', 'fixed', 'sticky']

// Font weight options
export const fontWeightOptions = [
  { label: 'Thin', value: '100' },
  { label: 'Extra Light', value: '200' },
  { label: 'Light', value: '300' },
  { label: 'Normal', value: '400' },
  { label: 'Medium', value: '500' },
  { label: 'Semi Bold', value: '600' },
  { label: 'Bold', value: '700' },
  { label: 'Extra Bold', value: '800' },
  { label: 'Black', value: '900' },
]

// Text align options
export const textAlignOptions = ['left', 'right', 'right', 'justify']

// Flex direction options
export const flexDirectionOptions = ['row', 'row-reverse', 'column', 'column-reverse']

// Justify content options
export const justifyContentOptions = [
  'flex-start',
  'flex-end',
  'center',
  'space-between',
  'space-around',
  'space-evenly',
]

// Align items options
export const alignItemsOptions = ['flex-start', 'flex-end', 'center', 'baseline', 'stretch']

// Common font families
export const fontFamilyOptions = [
  {
    label: 'System Default',
    value: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Helvetica', value: 'Helvetica, Arial, sans-serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Times New Roman', value: '"Times New Roman", Times, serif' },
  { label: 'Courier New', value: '"Courier New", Courier, monospace' },
  { label: 'Verdana', value: 'Verdana, Geneva, sans-serif' },
  { label: 'Trebuchet MS', value: '"Trebuchet MS", sans-serif' },
  { label: 'Impact', value: 'Impact, sans-serif' },
  { label: 'Comic Sans MS', value: '"Comic Sans MS", cursive' },
]

// border style options
export const borderStyleOptions = [
  'none',
  'solid',
  'dashed',
  'dotted',
  'double',
  'groove',
  'ridge',
  'inset',
  'outset',
]

const cssDesignerSlice = createSlice({
  name: 'cssDesigner',
  initialState,
  reducers: {
    toggleCSSDesigner: (state) => {
      state.isVisible = !state.isVisible
    },
    showCSSDesigner: (state) => {
      state.isVisible = true
    },
    hideCSSDesigner: (state) => {
      state.isVisible = false
    },
    setSelectedElement: (state, action: PayloadAction<CSSDesignerState['selectedElement']>) => {
      state.selectedElement = action.payload
    },
    setComputedStyles: (state, action: PayloadAction<Record<string, string>>) => {
      state.computedStyles = action.payload
    },

    setInlineStyles: (state, action: PayloadAction<Record<string, string>>) => {
      state.inlineStyles = action.payload
    },

    setMatchedRules: (state, action: PayloadAction<CSSRule[]>) => {
      state.matchedRules = action.payload
    },

    setActiveSection: (state, action: PayloadAction<CSSDesignerState['activeSection']>) => {
      state.activeSection = action.payload
    },

    setActiveSelector: (state, action: PayloadAction<string | null>) => {
      state.activeSelector = action.payload
    },

    updateBoxModel: (state, action: PayloadAction<Partial<BoxModelValues>>) => {
      state.boxModel = { ...state.boxModel, ...action.payload }
    },

    resetBoxModel: (state) => {
      state.boxModel = defaultBoxModel
    },

    toggleShowComputed: (state) => {
      state.showComputed = !state.showComputed
    },

    setColorFormat: (state, action: PayloadAction<CSSDesignerState['colorFormat']>) => {
      state.colorFormat = action.payload
    },

    updateGeneratedCSS: (state, action: PayloadAction<string>) => {
      state.generatedCSS = action.payload
    },

    // Update a single css property
    updateCSSProperty: (state, action: PayloadAction<{ property: string; value: string }>) => {
      const { property, value } = action.payload
      state.inlineStyles[property] = value

      // Update box model if relevant
      const boxModelProps: (keyof BoxModelValues)[] = [
        'marginTop',
        'marginRight',
        'marginBottom',
        'marginLeft',
        'paddingTop',
        'paddingRight',
        'paddingBottom',
        'paddingLeft',
        'borderTopWidth',
        'borderRightWidth',
        'borderBottomWidth',
        'borderLeftWidth',
        'width',
        'height',
      ]

      const propKey = property.replace(/-([a-z])/g, (g) =>
        g[1].toUpperCase()
      ) as keyof BoxModelValues
      if (boxModelProps.includes(propKey)) {
        state.boxModel[propKey] = value
      }
    },

    // Remove css property
    removeCSSProperty: (state, action: PayloadAction<string>) => {
      delete state.inlineStyles[action.payload]
    },

    clearSelection: (state) => {
      state.selectedElement = null
      state.computedStyles = {}
      state.inlineStyles = {}
      state.matchedRules = []
      state.boxModel = defaultBoxModel
    },
  },
})

export const {
  toggleCSSDesigner,
  showCSSDesigner,
  hideCSSDesigner,
  setActiveSection,
  setActiveSelector,
  setColorFormat,
  setComputedStyles,
  setInlineStyles,
  setMatchedRules,
  setSelectedElement,
  updateBoxModel,
  updateCSSProperty,
  updateGeneratedCSS,
  removeCSSProperty,
  resetBoxModel,
  clearSelection,
  toggleShowComputed,
} = cssDesignerSlice.actions
export default cssDesignerSlice.reducer
