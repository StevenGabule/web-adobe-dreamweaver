import React from 'react';
import { ChevronDown, ChevronRight, FilePlus, FolderPlus, RefreshCw, Search, X } from 'lucide-react';
import { closeContextMenu, collapseAll, createFile, createFolder, setSearchQuery } from './fileExplorerSlice';
import { useAppDispatch, useAppSelector } from '../../hook/useRedux';
import FileTreeNode from './FileTreeNode';
import ContextMenu from './ContextMenu';

const FileExplorer: React.FC = () => {
	const dispatch = useAppDispatch();
	const { tree, searchQuery, selectedPath } = useAppSelector(state => state.fileExplorer);
	const { currentProject } = useAppSelector(state => state.project)

	const [isSearching, setIsSearching] = React.useState(false)
	const [showNewFileInput, setShowNewFileInput] = React.useState(false)
	const [showNewFolderInput, setShowNewFolderInput] = React.useState(false)
	const [newItemName, setNewItemName] = React.useState('')
	const [isExplorerExpanded, setIsExplorerExpanded] = React.useState(true)

	const handleNewFile = () => {
		if (!newItemName.trim()) {
			setShowNewFileInput(false);
			return;
		}

		const parentPath = selectedPath || tree?.path || '/';
		dispatch(createFile({ parentPath, name: newItemName.trim() }))
		setNewItemName('');
		setShowNewFileInput(false);
	}

	const handleNewFolder = () => {
		if (!newItemName.trim()) {
			setShowNewFolderInput(false);
			return;
		}

		const parentPath = selectedPath || tree?.path || '/';
		dispatch(createFolder({ parentPath, name: newItemName.trim() }))
		setNewItemName('');
		setShowNewFolderInput(false);
	}

	const handleKeyDown = (e: React.KeyboardEvent, type: 'file' | 'folder') => {
		if (e.key === 'Enter') {
			// eslint-disable-next-line @typescript-eslint/no-unused-expressions
			type === 'file' ? handleNewFile : handleNewFolder();
		} else if (e.key === 'Escape') {
			setShowNewFileInput(false);
			setShowNewFolderInput(false);
			setNewItemName('')
		}
	}

	// Filter tree based on search query
	const filterTree = (node: typeof tree): typeof tree => {
		if (!node || !searchQuery) return node;

		const lowerQuery = searchQuery.toLowerCase();

		if (node.type === 'file') {
			return node.name.toLowerCase().includes(lowerQuery) ? node : null;
		}

		if (node.children) {
			const filteredChildren = node.children
				.map((child) => filterTree(child))
				.filter(Boolean) as NonNullable<typeof tree>[];

			if (filteredChildren.length > 0 || node.name.toLowerCase().includes(lowerQuery)) {
				return { ...node, children: filteredChildren, isExpanded: true }
			}
		}
		return null;
	}

	const displayTree = searchQuery ? filterTree(tree) : tree;

	return (
		<div className='flex flex-col h-full bg-sidebar-bg text-sidebar-fg' onClick={() => dispatch(closeContextMenu())}>
			{/* Explorer header */}
			<div className="flex items-center justify-between h-8.75 px-4 text-xxs font-medium uppercase tracking-wider text-sidebar-fg/70">
				<span>Explorer</span>
				<div className="flex items-center gap-1">
					<button
						onClick={() => setIsSearching(!isSearching)}
						className='p-1 rounded hover:bg-hover'
						title='Search files'
					>
						<Search size={14} />
					</button>
					<button title='New File' className='p-1 rounded hover:bg-hover' onClick={() => {
						setShowNewFileInput(true);
						setShowNewFolderInput(false);
					}}>
						<FilePlus size={14} />
					</button>
					<button title='New Folder' className='p-1 rounded hover:bg-hover' onClick={() => {
						setShowNewFolderInput(true);
						setShowNewFileInput(false);
					}}>
						<FolderPlus size={14} />
					</button>
					<button title='Collapse All' className='p-1 rounded hover:bg-hover' onClick={() => dispatch(collapseAll())}>
						<RefreshCw size={14} />
					</button>
				</div>
			</div>

			{/* Search input */}
			{isSearching && (
				<div className='px-2 pb-2'>
					<div className="relative">
						<input
							type='text'
							value={searchQuery}
							onChange={e => dispatch(setSearchQuery(e.target.value))}
							placeholder='Search files...'
							autoFocus
							className='w-full h-6 px-2 pr-6 text-xs border bg-editor-bg border-panel-border text-editor-fg placeholder:text-sidebar-fg/40 focus:border-focus-border focus:outline-none'
						/>
						{searchQuery && (
							<button
								onClick={() => dispatch(setSearchQuery(''))}
								className='absolute right-1 top-1/2 -translate-y-1/2 p-0.5 hover:bg-hover rounded'
							>
								<X size={12} />
							</button>
						)}
					</div>
				</div>
			)}
			{/* Project section */}
			<div className="flex-1 overflow-x-hidden overflow-y auto">
				{/* Project Header */}
				<div
					className="flex items-center px-2 cursor-pointer hover:bg-hover text-xs font-medium h-5.5"
					onClick={() => setIsExplorerExpanded(!isExplorerExpanded)}
				>
					<span className="mr-1">
						{isExplorerExpanded ? (
							<ChevronDown size={14} />
						) : (
							<ChevronRight size={14} />
						)}
					</span>
					<span className="tracking-wider uppercase text-xxs">
						{currentProject?.name || 'No Project'}
					</span>
				</div>

				{/* New File Input */}
				{showNewFileInput && (
					<div className='px-4 py-1'>
						<input
							type="text"
							value={newItemName}
							onChange={e => setNewItemName(e.target.value)}
							onKeyDown={e => handleKeyDown(e, 'file')}
							onBlur={handleNewFile}
							placeholder='Enter file name...'
							autoFocus
							className='w-full h-5.5 px-2 bg-editor-bg border border-focus-border text-editor-fg text-xs placeholder:text-sidebar-fg/40 focus:outline-none'
						/>
					</div>
				)}

				{/* New Folder Input */}
				{showNewFolderInput && (
					<div className='px-4 py-1'>
						<input
							type="text"
							value={newItemName}
							onChange={e => setNewItemName(e.target.value)}
							onKeyDown={e => handleKeyDown(e, 'folder')}
							onBlur={handleNewFolder}
							placeholder='Enter folder name...'
							autoFocus
							className='w-full h-5.5 px-2 bg-editor-bg border border-focus-border text-editor-fg text-xs placeholder:text-sidebar-fg/40 focus:outline-none'
						/>
					</div>
				)}

				{/* File Tree */}
				{isExplorerExpanded && displayTree && (
					<div>
						<FileTreeNode node={displayTree} />
					</div>
				)}

				{/* Empty State */}
				{isExplorerExpanded && !displayTree && (
					<div className='px-4 py-8 text-xs text-center text-sidebar-fg/50'>
						{searchQuery ? 'No files found' : 'No project open'}
					</div>
				)}
			</div>

			{/* Context Menu */}
			<ContextMenu />
		</div>
	)
}

export default FileExplorer;