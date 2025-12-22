import { useEffect, useRef, useState, type FC } from 'react'
import { useAppDispatch, useAppSelector } from '../../hook/useRedux'
import { saveFile, updateFileContent } from '../editor/editorSlice'
import { addToRecentInserts, insertCategories, insertItems, setActiveInsertCategory } from './toolbarSlice'
import { Bold, ChevronDown, Clock, Code, Eye, FileCode, FileInput, Hash, Heading1, Heading2, Heading3, Image, Italic, LayoutGrid, Link, List, ListOrdered, Minus, Palette, Plus, Quote, Redo, Save, Search, Settings2, Square, Table, Type, Underline, Undo } from 'lucide-react'
import { toggleCSSDesigner } from '../cssDesigner/cssDesignerSlice'
import { togglePreview } from '../preview/previewSlice'
import { toggleProperties } from '../properties/propertiesSlice'
import { toggleSearch } from '../search/searchSlice'

const Toolbar: FC = () => {
	const dispatch = useAppDispatch()
	const [showInsertMenu, setShowInsertMenu] = useState(false)
	const insertMenuRef = useRef<HTMLDivElement>(null)

	const { isVisible, activeInsertCategory, recentInserts } = useAppSelector(s => s.toolbar)
	const { openFiles, activeFileId } = useAppSelector(s => s.editor)
	const { isPanelVisible: isPreviewVisible } = useAppSelector(s => s.preview)
	const { isVisible: isCSSDesignerVisible } = useAppSelector(s => s.cssDesigner)
	const { isVisible: isPropertiesVisible } = useAppSelector(s => s.properties)
	const activeFile = openFiles.find(f => f.id === activeFileId);
	const isHtmlFile = activeFile?.language === 'html';

	// Close insert menu when clicking outside
	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (insertMenuRef.current && !insertMenuRef.current.contains(e.target as Node)) {
				setShowInsertMenu(false)
			}
		}

		if (showInsertMenu) {
			document.addEventListener('mousedown', handleClickOutside)
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [showInsertMenu])

	// Insert snippet at cursor position
	const insertSnippet = (snippet: string, itemId: string) => {
		if (!activeFile) return;

		// for now, append to content (in real app, would insert at cursor)
		const newContent = activeFile.content + "\n" + snippet;
		dispatch(updateFileContent({ fileId: activeFile.id, content: newContent }))
		dispatch(addToRecentInserts(itemId))
		setShowInsertMenu(false)
	}

	// Wrap selection with tags
	const wrapSelection = (tagOpen: string, tagClose: string) => {
		if (!activeFile) return;

		// Simplified - in real app would work with monaco selection
		const wrapped = `${tagOpen}${tagClose}`;
		const newContent = activeFile.content + '\n' + wrapped;
		dispatch(updateFileContent({ fileId: activeFile.id, content: newContent }))
	}

	const handleSave = () => {
		if (activeFile) {
			dispatch(saveFile(activeFile.id))
		}
	}

	// Get category icon
	const getCategoryIcon = (category: string) => {
		switch (category) {
			case 'Structure':
				return <LayoutGrid size={14} />
			case 'Headings':
				return <Heading1 size={14} />
			case 'Text':
				return <Type size={14} />
			case 'Links & Media':
				return <Link size={14} />
			case 'Lists':
				return <List size={14} />
			case 'Tables':
				return <Table size={14} />
			case 'Forms':
				return <FileInput size={14} />
			case 'Semantic':
				return <Hash size={14} />
			case 'Meta':
				return <Code size={14} />
			case 'Templates':
				return <FileCode size={14} />
			default:
				return <Square size={14} />
		}
	}

	if (!isVisible) return null;

	return (
		<div className='flex items-center gap-1 px-2 border-b h-9 bg-titlebar-bg border-panel-border'>
			{/* File Actions */}
			<div className="flex items-center gap-0.5 pr-2 border-r border-panel-border">
				<button
					onClick={handleSave}
					disabled={!activeFile?.isDirty}
					className='p-1.5 hover:bg-hover rounded disabled:opacity-30'
					title='Save (Ctrl+S)'
				>
					<Save size={16} className='text-sidebar-fg/70' />
				</button>
				<button
					className='p-1.5 hover:bg-hover rounded disabled:opacity-50'
					title="Undo (Ctrl+Z)"
					disabled
				>
					<Undo size={16} className='text-sidebar-fg/70' />
				</button>
				<button
					className='p-1.5 hover:bg-hover rounded disabled:opacity-50'
					title="Redo (Ctrl+Y)"
					disabled
				>
					<Redo size={16} className='text-sidebar-fg/70' />
				</button>
			</div>

			<div className="relative" ref={insertMenuRef}>
				<button
					onClick={() => setShowInsertMenu(!showInsertMenu)}
					className={`flex items-center gap-1 px-2 py-1 text-xs rounded ${showInsertMenu ? 'bg-accent text-white' : 'hover:bg-hover text-sidebar-fg'
						}`}
				>
					<Plus size={14} />
					<span>Insert</span>
					<ChevronDown size={12} />
				</button>

				{showInsertMenu && (
					<div className='absolute top-full left-0 mt-1 flex bg-[#3c3c3c] border border-[#454545] rounded shadow-xl z-50 animate-fade-in'>
						{/* Categories Sidebar */}
						<div className="w-40 border-r border-[#454545] py-1">
							<button
								onClick={() => dispatch(setActiveInsertCategory(null))}
								className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs ${!activeInsertCategory ? 'bg-accent text-white' : 'text-editor-fg hover:bg-hover'
									}`}
							>
								<Clock size={14} />
								<span>Recent</span>
							</button>
							<div className='my-1 border-t border-[#454545]' />
							{insertCategories.map((category) => (
								<button
									key={category}
									onClick={() => dispatch(setActiveInsertCategory(category))}
									className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs ${activeInsertCategory ? 'bg-accent text-white' : 'text-editor-fg hover:bg-hover'
										}`}
								>
									{getCategoryIcon(category)}
									<span>{category}</span>
								</button>
							))}
						</div>

						{/* Items Grid */}
						<div className="w-64 p-2 overflow-auto max-h-75">
							{!activeInsertCategory && recentInserts.length === 0 ? (
								<div className='py-8 text-xs text-center text-sidebar-fg/50'>
									No recent items.
									<br />
									Select a category to browse.
								</div>
							) : (
								<div className='grid grid-cols-2 gap-1'>
									{(activeInsertCategory
										? insertItems.filter(item => item.category === activeInsertCategory)
										: insertItems.filter(item => recentInserts.includes(item.id))).map((item) => (
											<button
												key={item.id}
												onClick={() => insertSnippet(item.snippet, item.id)}
												className="flex items-center gap-2 px-2 py-1.5 text-xs text-editor-fg hover:bg-hover rounded text-left"
												title={item.snippet}
											>
												<Code size={12} className='text-sidebar-fg/50 shrink-0' />
												<span className='truncate'>{item.name}</span>
											</button>
										))}
								</div>
							)}
						</div>
					</div>
				)}
			</div>

			{/* Text formatting (only for HTML files) */}
			{isHtmlFile && (
				<>
					<div className="w-px h-5 mx-1 bg-panel-border" />
					<div className="flex items-center gap-0.5">
						<button
							onClick={() => wrapSelection('<strong>', '</strong>')}
							className='p-1.5 hover:bg-hover rounded'
							title="Bold"
						>
							<Bold size={16} className='text-sidebar-fg/70' />
						</button>
						<button
							onClick={() => wrapSelection('<em>', '</em>')}
							className='p-1.5 hover:bg-hover rounded'
							title="Italic"
						>
							<Italic size={16} className='text-sidebar-fg/70' />
						</button>
						<button
							onClick={() => wrapSelection('<u>', '</u>')}
							className='p-1.5 hover:bg-hover rounded'
							title="Underline"
						>
							<Underline size={16} className='text-sidebar-fg/70' />
						</button>
					</div>

					<div className="w-px h-5 mx-1 bg-panel-border" />

					<div className="flex items-center gap-0.5">
						<button
							onClick={() =>
								insertSnippet('<a href="#">Link</a>', 'a')
							}
							className="p-1.5 hover:bg-hover rounded"
							title="Insert Link"
						>
							<Link size={16} className="text-sidebar-fg/70" />
						</button>
						<button
							onClick={() =>
								insertSnippet('<img src="" alt="">', 'img')
							}
							className="p-1.5 hover:bg-hover rounded"
							title="Insert Image"
						>
							<Image size={16} className="text-sidebar-fg/70" />
						</button>
					</div>
					<div className="w-px h-5 mx-1 bg-panel-border" />
					<div className="flex items-center gap-0.5">
						<button
							onClick={() =>
								insertSnippet('<h1></h1>', 'h1')
							}
							className="p-1.5 hover:bg-hover rounded"
							title="Heading 1"
						>
							<Heading1 size={16} className="text-sidebar-fg/70" />
						</button>
						<button
							onClick={() =>
								insertSnippet('<h2></h2>', 'h2')
							}
							className="p-1.5 hover:bg-hover rounded"
							title="Heading 2"
						>
							<Heading2 size={16} className="text-sidebar-fg/70" />
						</button>
						<button
							onClick={() =>
								insertSnippet('<h3></h3>', 'h3')
							}
							className="p-1.5 hover:bg-hover rounded"
							title="Heading 3"
						>
							<Heading3 size={16} className="text-sidebar-fg/70" />
						</button>
					</div>
					<div className="w-px h-5 mx-1 bg-panel-border" />
					<div className="flex items-center gap-0.5">
						<button
							onClick={() =>
								insertSnippet('<ul>\n  <li></li>\n</ul>', 'ul')
							}
							className="p-1.5 hover:bg-hover rounded"
							title="Unordered List"
						>
							<List size={16} className="text-sidebar-fg/70" />
						</button>
						<button
							onClick={() =>
								insertSnippet('<ol>\n  <li></li>\n</ol>', 'ol')
							}
							className="p-1.5 hover:bg-hover rounded"
							title="Ordered List"
						>
							<ListOrdered size={16} className="text-sidebar-fg/70" />
						</button>
						<button
							onClick={() =>
								insertSnippet(
									'<table>\n  <tr>\n    <td></td>\n  </tr>\n</table>',
									'table'
								)
							}
							className="p-1.5 hover:bg-hover rounded"
							title="Table"
						>
							<Table size={16} className="text-sidebar-fg/70" />
						</button>
					</div>
					<div className="w-px h-5 mx-1 bg-panel-border" />
					<div className="flex items-center gap-0.5">
						<button
							onClick={() => wrapSelection('<code>', '</code>')}
							className="p-1.5 hover:bg-hover rounded"
							title="Code"
						>
							<Code size={16} className="text-sidebar-fg/70" />
						</button>
						<button
							onClick={() =>
								wrapSelection('<blockquote>', '</blockquote>')
							}
							className="p-1.5 hover:bg-hover rounded"
							title="Blockquote"
						>
							<Quote size={16} className="text-sidebar-fg/70" />
						</button>
						<button
							onClick={() => insertSnippet('<hr>', 'hr')}
							className="p-1.5 hover:bg-hover rounded"
							title="Horizontal Rule"
						>
							<Minus size={16} className="text-sidebar-fg/70" />
						</button>
					</div>
				</>
			)}

			{/* Spacer */}
			<div className="flex-1" />

			{/* Right Actions */}
			<div className="flex items-center gap-0.5">
				<button
					onClick={() => dispatch(toggleSearch())}
					className="p-1.5 hover:bg-hover rounded"
					title="Find & Replace (Ctrl+F)"
				>
					<Search size={16} className="text-sidebar-fg/70" />
				</button>
				<button
					onClick={() => dispatch(togglePreview())}
					className={`p-1.5 rounded ${isPreviewVisible ? 'bg-accent' : 'hover:bg-hover'
						}`}
					title="Toggle Preview (Ctrl+Shift+P)"
				>
					<Eye
						size={16}
						className={isPreviewVisible ? 'text-white' : 'text-sidebar-fg/70'}
					/>
				</button>

				<div className="w-px h-5 mx-1 bg-panel-border" />

				<button
					onClick={() => dispatch(toggleCSSDesigner())}
					className={`p-1.5 rounded ${isCSSDesignerVisible ? 'bg-accent' : 'hover:bg-hover'
						}`}
					title="CSS Designer (Ctrl+Shift+C)"
				>
					<Palette
						size={16}
						className={isCSSDesignerVisible ? 'text-white' : 'text-sidebar-fg/70'}
					/>
				</button>
				<button
					onClick={() => dispatch(toggleProperties())}
					className={`p-1.5 rounded ${isPropertiesVisible ? 'bg-accent' : 'hover:bg-hover'
						}`}
					title="Properties (Ctrl+Shift+I)"
				>
					<Settings2
						size={16}
						className={isPropertiesVisible ? 'text-white' : 'text-sidebar-fg/70'}
					/>
				</button>
			</div>
		</div>
	)
}

export default Toolbar