import { useEffect, useRef, type FC, type ReactNode } from 'react';
import { useAppDispatch, useAppSelector } from '../../hook/useRedux';
import { closeContextMenu, copyNode, createFile, createFolder, cutNode, deleteNode } from './fileExplorerSlice';
import { Clipboard, Copy, Edit3, ExternalLink, FileCode, FilePlus, FolderPlus, Scissors, Trash2 } from 'lucide-react';
import { handleFileDelete, openFile } from '../editor/editorSlice';

const ContextMenu: FC = () => {
	const dispatch = useAppDispatch();
	const { contextMenu, tree } = useAppSelector(state => state.fileExplorer)
	const menuRef = useRef<HTMLDivElement>(null)
	const { isOpen, x, y, targetPath } = contextMenu;

	// Find the target node
	const findNode = (node: typeof tree, path: string): NonNullable<typeof tree> | null => {
		if (!node) return null;
		if (node.path === path) return node;
		if (node.children) {
			for (const child of node.children) {
				const found = findNode(child, path);
				if (found) return found;
			}
		}
		return null;
	}

	const targetNode = targetPath ? findNode(tree, targetPath) : null;
	const isFolder = targetNode?.type === 'folder';

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
				dispatch(closeContextMenu())
			}
		}

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				dispatch(closeContextMenu())
			}
		}

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
			document.addEventListener('keydown', handleKeyDown);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
			document.removeEventListener('keydown', handleKeyDown);
		}
	}, [isOpen, dispatch]);

	// Adjust position to keep menu in viewport
	useEffect(() => {
		if (isOpen && menuRef.current) {
			const menu = menuRef.current;
			const rect = menu.getBoundingClientRect();
			const viewportWidth = window.innerWidth;
			const viewportHeight = window.innerHeight;

			let adjustedX = x;
			let adjustedY = y;

			if (x + rect.width > viewportWidth) {
				adjustedX = viewportWidth - rect.width - 8;
			}

			if (y + rect.height > viewportHeight) {
				adjustedY = viewportHeight - rect.height - 8;
			}

			menu.style.left = `${adjustedX}px`;
			menu.style.top = `${adjustedY}px`;
		}
	}, [isOpen, x, y])

	if (!isOpen || !targetPath) return null;

	const handleAction = (action: () => void) => {
		action();
		dispatch(closeContextMenu())
	}

	const menuItems = [
		// File operations
		...(isFolder ?
			[
				{
					icon: <FilePlus size={14} />,
					label: 'New File',
					onClick: () => handleAction(() => {
						const name = prompt("Enter file name:");
						if (name) {
							dispatch(createFile({ parentPath: targetPath, name }))
						}
					})
				},
				{
					icon: <FolderPlus size={14} />,
					label: 'New Folder',
					onClick: () => handleAction(() => {
						const name = prompt("Enter folder name:");
						if (name) {
							dispatch(createFolder({ parentPath: targetPath, name }))
						}
					})
				},
				{ separator: true }
			] : [
				{
					icon: <FileCode size={14} />,
					label: 'Open',
					onClick: () => handleAction(() => dispatch(openFile({ path: targetPath })))
				},
				{
					icon: <ExternalLink size={14} />,
					label: 'Open to the Side',
					onClick: () => handleAction(() => dispatch(openFile({ path: targetPath })))
				},
				{ separation: true }
			]),
		// Edit operations
		{
			icon: <Copy size={14} />,
			label: 'Copy',
			shortcut: '⌘C',
			onClick: () => handleAction(() => dispatch(copyNode(targetPath)))
		},
		{
			icon: <Scissors size={14} />,
			label: 'Cut',
			shortcut: '⌘X',
			onClick: () => handleAction(() => dispatch(cutNode(targetPath)))
		},
		{
			icon: <Clipboard size={14} />,
			label: 'Paste',
			shortcut: '⌘V',
			disabled: true, // enable when clipboard has content
			onClick: () => { }
		},
		{ separator: true },
		{
			icon: <Edit3 size={14} />,
			label: 'Rename',
			shortcut: 'F2',
			onClick: () => handleAction(() => {
				const newName = prompt("Enter new name:", targetNode?.name)
				if (newName && newName !== targetNode?.name) {
					// handle rename
				}
			})
		},
		{
			icon: <Trash2 size={14} />,
			label: 'Delete',
			shortcut: '⌫',
			danger: true,
			onClick: () => handleAction(() => {
				if (confirm(`Delete ${targetNode?.name}`)) {
					dispatch(deleteNode(targetPath))
					dispatch(handleFileDelete(targetPath))
				}
			})
		},
	];

	return (
		<div
			ref={menuRef}
			className='fixed z-50 min-w-45 bg-[#3c3c3c border border-[#454545] shadow-xl rounded-md animate-fade-in'
			style={{ left: x, top: y }}>
			{menuItems.map((item, index) => {
				if ('separator' in item && item.separator) {
					return (
						<div key={`sep-${index}`} className='my-1 border-t border-[#454545]' />
					)
				}

				const { icon, label, shortcut, danger, disabled, onClick } = item as {
					icon: ReactNode;
					label: string;
					shortcut?: string;
					disabled?: boolean;
					danger?: boolean;
					onClick: () => void;
				}

				return (
					<button
						key={label}
						onClick={onClick}
						disabled={disabled}
						className={`w-full flex items-center gap-3 px-3 py-1.5 text-xs 
							${disabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-accent'} 
							${danger ? 'text-error hover:text-white' : 'text-editor-fg'}
							`}
					>
						<span className="flex items-center justify-center w-4 h-4 opacity-70">
							{icon}
						</span>
						<span className="flex-1 text-left">{label}</span>
						{shortcut && (
							<span className="text-xxs text-sidebar-fg/50">{shortcut}</span>
						)}
					</button>
				)
			})}
		</div>
	)
}

export default ContextMenu;