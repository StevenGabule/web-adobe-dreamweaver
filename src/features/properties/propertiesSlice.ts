import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface ElementAttribute {
  name: string
  value: string
}

interface ElementInfo {
  tagName: string
  id: string
  className: string
  attributes: ElementAttribute[]
  textContent?: string
  innerHTML?: string
  path: string
}

interface PropertiesState {
  isVisible: boolean
  selectedElement: ElementInfo | null
  activeTab: 'attributes' | 'events' | 'accessibility'
  editingAttribute: string | null
}

const initialState: PropertiesState = {
  isVisible: false,
  selectedElement: null,
  activeTab: 'attributes',
  editingAttribute: null,
}

// Element-specific attributes
export const elementAttributes: Record<string, string[]> = {
  // Global attributes (available on all elements)
  _global: ['id', 'class', 'style', 'title', 'lang', 'dir', 'tabindex', 'hidden', 'draggable'],
  // Link
  a: ['href', 'target', 'rel', 'download', 'hreflang', 'type'],
  // Images
  img: ['src', 'alt', 'width', 'height', 'loading', 'decoding', 'srcset', 'sizes'],
  // Media
  video: ['src', 'poster', 'width', 'height', 'autoplay', 'controls', 'loop', 'muted', 'preload'],
  audio: ['src', 'autoplay', 'controls', 'loop', 'muted', 'preload'],
  source: ['src', 'type', 'srcset', 'sizes', 'media'],

  // Form elements
  form: ['action', 'method', 'enctype', 'target', 'autocomplete', 'novalidate'],
  input: [
    'type',
    'name',
    'value',
    'placeholder',
    'required',
    'disabled',
    'readonly',
    'min',
    'max',
    'step',
    'pattern',
    'autocomplete',
    'autofocus',
    'checked',
    'multiple',
    'accept',
  ],
  textarea: [
    'name',
    'placeholder',
    'required',
    'disabled',
    'readonly',
    'rows',
    'cols',
    'wrap',
    'maxlength',
    'minlength',
  ],
  select: ['name', 'required', 'disabled', 'multiple', 'size'],
  option: ['value', 'selected', 'disabled', 'label'],
  button: ['type', 'name', 'value', 'disabled', 'form'],
  label: ['for'],
  fieldset: ['disabled', 'form', 'name'],
  // Table
  table: ['border', 'cellpadding', 'cellspacing'],
  td: ['colspan', 'rowspan', 'headers'],
  th: ['colspan', 'rowspan', 'headers', 'scope'],
  col: ['span'],
  colgroup: ['span'],

  // Lists
  ol: ['type', 'start', 'reversed'],
  li: ['value'],

  // Iframe
  iframe: ['src', 'srcdoc', 'name', 'width', 'height', 'sandbox', 'allow', 'loading'],

  // Meta
  meta: ['name', 'content', 'charset', 'http-equiv'],
  link: ['href', 'rel', 'type', 'media', 'sizes'],
  script: ['src', 'type', 'async', 'defer', 'crossorigin'],
  style: ['type', 'media'],

  // Other
  blockquote: ['cite'],
  q: ['cite'],
  time: ['datetime'],
  progress: ['value', 'max'],
  meter: ['value', 'min', 'max', 'low', 'high', 'optimum'],
  details: ['open'],
  dialog: ['open'],
  canvas: ['width', 'height'],
  object: ['data', 'type', 'width', 'height'],
  embed: ['src', 'type', 'width', 'height'],
}

// Accessibility attributes (ARIA)
export const ariaAttributes = [
  'role',
  'aria-label',
  'aria-labelledby',
  'aria-describedby',
  'aria-hidden',
  'aria-disabled',
  'aria-expanded',
  'aria-selected',
  'aria-checked',
  'aria-pressed',
  'aria-current',
  'aria-live',
  'aria-atomic',
  'aria-busy',
  'aria-controls',
  'aria-haspopup',
  'aria-owns',
  'aria-flowto',
  'aria-required',
  'aria-invalid',
  'aria-errormessage',
  'aria-valuemin',
  'aria-valuemax',
  'aria-valuenow',
  'aria-valuetext',
]

// Common event handlers
export const eventHandlers = [
  // Mouse events
  'onclick',
  'ondblclick',
  'onmousedown',
  'onmouseup',
  'onmouseover',
  'onmouseout',
  'onmousemove',
  'onmouseenter',
  'onmouseleave',
  'oncontextmenu',

  // Keyboard events
  'onkeydown',
  'onkeyup',
  'onkeypress',

  // Focus events
  'onfocus',
  'onblur',
  'onfocusin',
  'onfocusout',

  // Form events
  'onchange',
  'oninput',
  'onsubmit',
  'onreset',
  'oninvalid',

  // Drag events
  'ondrag',
  'ondragstart',
  'ondragend',
  'ondragenter',
  'ondragleave',
  'ondragover',
  'ondrop',

  // Clipboard events
  'oncopy',
  'oncut',
  'onpaste',

  // Media events
  'onplay',
  'onpause',
  'onended',
  'onvolumechange',
  'ontimeupdate',

  // Other
  'onload',
  'onerror',
  'onscroll',
  'onresize',
]

// Input types
export const inputTypes = [
  'text',
  'password',
  'email',
  'number',
  'tel',
  'url',
  'search',
  'date',
  'time',
  'datetime-local',
  'month',
  'week',
  'color',
  'range',
  'file',
  'hidden',
  'checkbox',
  'radio',
  'submit',
  'reset',
  'button',
  'image',
]

// Link targets
export const linkTargets = ['_self', '_blank', '_parent', '_top']

// Link rel values
export const linkRelValues = [
  'alternate',
  'author',
  'bookmark',
  'external',
  'help',
  'license',
  'next',
  'nofollow',
  'noopener',
  'noreferrer',
  'prev',
  'search',
  'tag',
]

// Button types
export const buttonTypes = ['button', 'submit', 'reset']

const propertiesSlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    toggleProperties: (state) => {
      state.isVisible = !state.isVisible
    },
    showProperties: (state) => {
      state.isVisible = true
    },
    hideProperties: (state) => {
      state.isVisible = false
    },
    setSelectedElement: (state, action: PayloadAction<ElementInfo | null>) => {
      state.selectedElement = action.payload
      state.editingAttribute = null
    },
    setActiveTab: (state, action: PayloadAction<PropertiesState['activeTab']>) => {
      state.activeTab = action.payload
    },
    setEditingAttribute: (state, action: PayloadAction<string | null>) => {
      state.editingAttribute = action.payload
    },
    updateAttribute: (state, action: PayloadAction<{ name: string; value: string }>) => {
      if (state.selectedElement) {
        const { name, value } = action.payload
        const attrIndex = state.selectedElement.attributes.findIndex((a) => a.name === name)
        if (attrIndex === -1) {
          state.selectedElement.attributes[attrIndex].value = value
        } else {
          state.selectedElement.attributes.push({ name, value })
        }

        // update common properties
        if (name === 'id') {
          state.selectedElement.id = value
        }
      }
    },
    removeAttribute: (state, action: PayloadAction<string>) => {
      if (state.selectedElement) {
        state.selectedElement.attributes = state.selectedElement.attributes.filter(
          (a) => a.name !== action.payload
        )

        if (action.payload === 'id') {
          state.selectedElement.id = ''
        } else if (action.payload === 'class') {
          state.selectedElement.className = ''
        }
      }
    },
    clearSelection: (state) => {
      state.selectedElement = null
      state.editingAttribute = null
    },
  },
})

export const {
  toggleProperties,
  showProperties,
  hideProperties,
  setSelectedElement,
  setActiveTab,
  setEditingAttribute,
  updateAttribute,
  removeAttribute,
  clearSelection,
} = propertiesSlice.actions
export default propertiesSlice.reducer
