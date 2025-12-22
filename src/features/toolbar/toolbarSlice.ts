import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface InsertItem {
  id: string
  name: string
  category: string
  icon: string
  snippet: string
  description?: string
}

interface ToolbarState {
  isVisible: boolean
  activeInsertCategory: string | null
  recentInserts: string[]
  favorites: string[]
}

const initialState: ToolbarState = {
  isVisible: true,
  activeInsertCategory: null,
  recentInserts: [],
  favorites: [],
}

// Pre-defined insert items
export const insertItems: InsertItem[] = [
  // Structure
  { id: 'div', name: 'Div', category: 'Structure', icon: 'square', snippet: '<div>\n  \n</div>' },
  {
    id: 'section',
    name: 'Section',
    category: 'Structure',
    icon: 'layout',
    snippet: '<section>\n  \n</section>',
  },
  {
    id: 'article',
    name: 'Article',
    category: 'Structure',
    icon: 'file-text',
    snippet: '<article>\n  \n</article>',
  },
  {
    id: 'header',
    name: 'Header',
    category: 'Structure',
    icon: 'layout',
    snippet: '<header>\n  \n</header>',
  },
  {
    id: 'footer',
    name: 'Footer',
    category: 'Structure',
    icon: 'layout',
    snippet: '<footer>\n  \n</footer>',
  },
  { id: 'nav', name: 'Nav', category: 'Structure', icon: 'menu', snippet: '<nav>\n  \n</nav>' },
  {
    id: 'main',
    name: 'Main',
    category: 'Structure',
    icon: 'layout',
    snippet: '<main>\n  \n</main>',
  },
  {
    id: 'aside',
    name: 'Aside',
    category: 'Structure',
    icon: 'sidebar',
    snippet: '<aside>\n  \n</aside>',
  },

  // Headings
  { id: 'h1', name: 'Heading 1', category: 'Headings', icon: 'heading', snippet: '<h1></h1>' },
  { id: 'h2', name: 'Heading 2', category: 'Headings', icon: 'heading', snippet: '<h2></h2>' },
  { id: 'h3', name: 'Heading 3', category: 'Headings', icon: 'heading', snippet: '<h3></h3>' },
  { id: 'h4', name: 'Heading 4', category: 'Headings', icon: 'heading', snippet: '<h4></h4>' },
  { id: 'h5', name: 'Heading 5', category: 'Headings', icon: 'heading', snippet: '<h5></h5>' },
  { id: 'h6', name: 'Heading 6', category: 'Headings', icon: 'heading', snippet: '<h6></h6>' },

  // Text
  { id: 'p', name: 'Paragraph', category: 'Text', icon: 'text', snippet: '<p></p>' },
  { id: 'span', name: 'Span', category: 'Text', icon: 'type', snippet: '<span></span>' },
  { id: 'strong', name: 'Bold', category: 'Text', icon: 'bold', snippet: '<strong></strong>' },
  { id: 'em', name: 'Italic', category: 'Text', icon: 'italic', snippet: '<em></em>' },
  { id: 'u', name: 'Underline', category: 'Text', icon: 'underline', snippet: '<u></u>' },
  {
    id: 'mark',
    name: 'Highlight',
    category: 'Text',
    icon: 'highlighter',
    snippet: '<mark></mark>',
  },
  { id: 'code', name: 'Code', category: 'Text', icon: 'code', snippet: '<code></code>' },
  {
    id: 'pre',
    name: 'Preformatted',
    category: 'Text',
    icon: 'file-code',
    snippet: '<pre>\n  \n</pre>',
  },
  {
    id: 'blockquote',
    name: 'Blockquote',
    category: 'Text',
    icon: 'quote',
    snippet: '<blockquote>\n  \n</blockquote>',
  },
  { id: 'br', name: 'Line Break', category: 'Text', icon: 'corner-down-left', snippet: '<br>' },
  { id: 'hr', name: 'Horizontal Rule', category: 'Text', icon: 'minus', snippet: '<hr>' },

  // Links & Media
  {
    id: 'a',
    name: 'Link',
    category: 'Links & Media',
    icon: 'link',
    snippet: '<a href="#">Link text</a>',
  },
  {
    id: 'img',
    name: 'Image',
    category: 'Links & Media',
    icon: 'image',
    snippet: '<img src="" alt="">',
  },
  {
    id: 'video',
    name: 'Video',
    category: 'Links & Media',
    icon: 'video',
    snippet: '<video controls>\n  <source src="" type="video/mp4">\n</video>',
  },
  {
    id: 'audio',
    name: 'Audio',
    category: 'Links & Media',
    icon: 'volume-2',
    snippet: '<audio controls>\n  <source src="" type="audio/mpeg">\n</audio>',
  },
  {
    id: 'iframe',
    name: 'iFrame',
    category: 'Links & Media',
    icon: 'frame',
    snippet: '<iframe src="" frameborder="0"></iframe>',
  },

  // Lists
  {
    id: 'ul',
    name: 'Unordered List',
    category: 'Lists',
    icon: 'list',
    snippet: '<ul>\n  <li></li>\n  <li></li>\n</ul>',
  },
  {
    id: 'ol',
    name: 'Ordered List',
    category: 'Lists',
    icon: 'list-ordered',
    snippet: '<ol>\n  <li></li>\n  <li></li>\n</ol>',
  },
  { id: 'li', name: 'List Item', category: 'Lists', icon: 'minus', snippet: '<li></li>' },
  {
    id: 'dl',
    name: 'Definition List',
    category: 'Lists',
    icon: 'list',
    snippet: '<dl>\n  <dt>Term</dt>\n  <dd>Definition</dd>\n</dl>',
  },

  // Tables
  {
    id: 'table',
    name: 'Table',
    category: 'Tables',
    icon: 'table',
    snippet:
      '<table>\n  <thead>\n    <tr>\n      <th>Header</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Cell</td>\n    </tr>\n  </tbody>\n</table>',
  },
  {
    id: 'tr',
    name: 'Table Row',
    category: 'Tables',
    icon: 'table',
    snippet: '<tr>\n  <td></td>\n</tr>',
  },
  { id: 'td', name: 'Table Cell', category: 'Tables', icon: 'table', snippet: '<td></td>' },
  { id: 'th', name: 'Table Header', category: 'Tables', icon: 'table', snippet: '<th></th>' },

  // Forms
  {
    id: 'form',
    name: 'Form',
    category: 'Forms',
    icon: 'file-input',
    snippet: '<form action="" method="post">\n  \n</form>',
  },
  {
    id: 'input-text',
    name: 'Text Input',
    category: 'Forms',
    icon: 'text-cursor',
    snippet: '<input type="text" name="" placeholder="">',
  },
  {
    id: 'input-email',
    name: 'Email Input',
    category: 'Forms',
    icon: 'mail',
    snippet: '<input type="email" name="" placeholder="">',
  },
  {
    id: 'input-password',
    name: 'Password Input',
    category: 'Forms',
    icon: 'key',
    snippet: '<input type="password" name="" placeholder="">',
  },
  {
    id: 'input-number',
    name: 'Number Input',
    category: 'Forms',
    icon: 'hash',
    snippet: '<input type="number" name="">',
  },
  {
    id: 'input-checkbox',
    name: 'Checkbox',
    category: 'Forms',
    icon: 'check-square',
    snippet: '<input type="checkbox" name="" id="">\n<label for="">Label</label>',
  },
  {
    id: 'input-radio',
    name: 'Radio',
    category: 'Forms',
    icon: 'circle',
    snippet: '<input type="radio" name="" id="" value="">\n<label for="">Label</label>',
  },
  {
    id: 'textarea',
    name: 'Textarea',
    category: 'Forms',
    icon: 'align-left',
    snippet: '<textarea name="" rows="4" cols="50"></textarea>',
  },
  {
    id: 'select',
    name: 'Select',
    category: 'Forms',
    icon: 'chevron-down',
    snippet:
      '<select name="">\n  <option value="">Option 1</option>\n  <option value="">Option 2</option>\n</select>',
  },
  {
    id: 'button',
    name: 'Button',
    category: 'Forms',
    icon: 'square',
    snippet: '<button type="button">Button</button>',
  },
  {
    id: 'button-submit',
    name: 'Submit Button',
    category: 'Forms',
    icon: 'send',
    snippet: '<button type="submit">Submit</button>',
  },
  {
    id: 'label',
    name: 'Label',
    category: 'Forms',
    icon: 'tag',
    snippet: '<label for="">Label</label>',
  },

  // Semantic
  {
    id: 'figure',
    name: 'Figure',
    category: 'Semantic',
    icon: 'image',
    snippet: '<figure>\n  <img src="" alt="">\n  <figcaption>Caption</figcaption>\n</figure>',
  },
  {
    id: 'details',
    name: 'Details',
    category: 'Semantic',
    icon: 'chevron-down',
    snippet: '<details>\n  <summary>Summary</summary>\n  Content here\n</details>',
  },
  {
    id: 'time',
    name: 'Time',
    category: 'Semantic',
    icon: 'clock',
    snippet: '<time datetime="">Time</time>',
  },
  {
    id: 'address',
    name: 'Address',
    category: 'Semantic',
    icon: 'map-pin',
    snippet: '<address>\n  \n</address>',
  },

  // Meta & Head
  {
    id: 'meta-charset',
    name: 'Meta Charset',
    category: 'Meta',
    icon: 'code',
    snippet: '<meta charset="UTF-8">',
  },
  {
    id: 'meta-viewport',
    name: 'Meta Viewport',
    category: 'Meta',
    icon: 'smartphone',
    snippet: '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
  },
  {
    id: 'meta-description',
    name: 'Meta Description',
    category: 'Meta',
    icon: 'file-text',
    snippet: '<meta name="description" content="">',
  },
  {
    id: 'link-css',
    name: 'Link CSS',
    category: 'Meta',
    icon: 'link',
    snippet: '<link rel="stylesheet" href="styles.css">',
  },
  {
    id: 'script',
    name: 'Script',
    category: 'Meta',
    icon: 'code',
    snippet: '<script src=""></script>',
  },
  {
    id: 'script-inline',
    name: 'Script Inline',
    category: 'Meta',
    icon: 'code',
    snippet: '<script>\n  \n</script>',
  },
  {
    id: 'style',
    name: 'Style',
    category: 'Meta',
    icon: 'palette',
    snippet: '<style>\n  \n</style>',
  },

  // Templates
  {
    id: 'html5',
    name: 'HTML5 Boilerplate',
    category: 'Templates',
    icon: 'file-code',
    snippet:
      '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Document</title>\n</head>\n<body>\n  \n</body>\n</html>',
  },
  {
    id: 'comment',
    name: 'Comment',
    category: 'Templates',
    icon: 'message-square',
    snippet: '<!-- -->',
  },
]

// Get unique categories
export const insertCategories = [...new Set(insertItems.map((item) => item.category))]

const toolbarSlice = createSlice({
  name: 'toolbar',
  initialState,
  reducers: {
    toggleToolbar: (state) => {
      state.isVisible = !state.isVisible
    },
    showToolbar: (state) => {
      state.isVisible = true
    },
    hideToolbar: (state) => {
      state.isVisible = false
    },
    setActiveInsertCategory: (state, action: PayloadAction<string | null>) => {
      state.activeInsertCategory = action.payload
    },
    addToRecentInserts: (state, action: PayloadAction<string>) => {
      const itemId = action.payload
      state.recentInserts = [itemId, ...state.recentInserts.filter((id) => id !== itemId)].slice(
        0,
        10
      )
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const itemId = action.payload
      if (state.favorites.includes(itemId)) {
        state.favorites = state.favorites.filter((id) => id !== itemId)
      } else {
        state.favorites.push(itemId)
      }
    },
    clearRecentInserts: (state) => {
      state.recentInserts = []
    },
  },
})

export const {
  toggleToolbar,
  showToolbar,
  hideToolbar,
  setActiveInsertCategory,
  addToRecentInserts,
  toggleFavorite,
  clearRecentInserts,
} = toolbarSlice.actions

export default toolbarSlice.reducer
