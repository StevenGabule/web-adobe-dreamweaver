import React from 'react';
import type { FileNode } from '../../types';
import { useAppDispatch, useAppSelector } from '../../hook/useRedux';
import { openContextMenu, renameNode, selectFile, toggleFolder } from './fileExplorerSlice';
import { openFile } from '../editor/editorSlice';
import { ChevronDown, ChevronRight } from 'lucide-react';
import FileIcon from '../../components/ui/FileIcon';

interface FileTreeNodeProps {
	node: FileNode;
	depth?: number;
}

const FileTreeNode: React.FC<FileTreeNodeProps> = ({ node, depth = 0 }) => {
	const dispatch = useAppDispatch();
	const { selectedPath, expandedFolders } = useAppSelector(state => state.fileExplorer)

	const [isRenaming, setIsRenaming] = React.useState(false)
	const [renameValue, setRenameValue] = React.useState(node.name)
	const inputRef = React.useRef<HTMLInputElement>(null);

	const isSelected = selectedPath === node.path;
	const isExpanded = expandedFolders.includes(node.path);
	const isFolder = node.type === 'folder';

	React.useEffect(() => {
		if (isRenaming && inputRef.current) {
			inputRef.current.focus();
			inputRef.current.select();
		}
	}, [isRenaming]);

	const handleClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		dispatch(selectFile(node.path))

		if (isFolder) {
			dispatch(toggleFolder(node.path));
		}
	}

	const handleDoubleClick = (e: React.MouseEvent) => {
		e.stopPropagation();

		if (!isFolder) {
			dispatch(openFile({ path: node.path }))
		}
	}

	const handleContextMenu = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		dispatch(selectFile(node.path));
		dispatch(
			openContextMenu({
				x: e.clientX,
				y: e.clientY,
				targetPath: node.path
			})
		)
	}

	const handleRenameSubmit = () => {
		if (renameValue.trim() && renameValue !== node.name) {
			dispatch(renameNode({ path: node.path, newName: renameValue.trim() }))
		}
		setIsRenaming(false);
		setRenameValue(node.name)
	}

	const handleRenameKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleRenameSubmit()
		} else if (e.key === 'Escape') {
			setIsRenaming(false);
			setRenameValue(node.name)
		}
	}

	const paddingLeft = depth * 12 + 8;

	return (
		<div className="select-none">
			<div

				className={`flex items-center h-5.5 cursor-pointer hover:bg-hover group ${isSelected ? 'bg-selected' : ''}`}
				style={{ paddingLeft }}
				onClick={handleClick}
				onDoubleClick={handleDoubleClick}
				onContextMenu={handleContextMenu}
			>
				{/* Expand/Collapse Arrow */}
				<span className="items-center justify-center w-4 h-4 shrink-0">
					{isFolder && (
						<span className='text-sidebar-fg/60'>
							{isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
						</span>
					)}
				</span>

				{/* File/Folder icon */}
				<span className="flex items-center mr-1 5">
					<FileIcon
						filename={node.name}
						isFolder={isFolder}
						isExpanded={isExpanded}
						size={16}
					/>
				</span>

				{/* Filename */}
				{isRenaming ? (
					<input
						ref={inputRef}
						type={'text'}
						value={renameValue}
						onChange={e => setRenameValue(e.target.value)}
						onBlur={handleRenameSubmit}
						onKeyDown={handleRenameKeyDown}
						className='flex-1 min-w-0 h-4.5 px-1 bg-editor-bg border border-focus-border text-editor-fg text-xs outline-none'
						onClick={e => e.stopPropagation()}
					/>
				) : (
					<span className='text-xs truncate text-sidebar-fg'>{node.name}</span>
				)}
			</div>

			{/* Children */}
			{isFolder && isExpanded && node.children && (
				<div>
					{node.children.map((child) => (
						<FileTreeNode key={child.id} node={child} depth={depth + 1} />
					))}
				</div>
			)}
		</div>
	)
}

export default FileTreeNode;