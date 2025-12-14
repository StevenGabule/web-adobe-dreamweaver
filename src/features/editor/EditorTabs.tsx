import React from 'react';
import { useAppDispatch, useAppSelector } from '../../hook/useRedux';
import { closeAllFiles, closeFile, closeOtherFiles, saveFile, setActiveFile } from './editorSlice';
import FileIcon from '../../components/ui/FileIcon';
import { Circle, X } from 'lucide-react';

const EditorTabs: React.FC = () => {
	const dispatch = useAppDispatch();
	const { openFiles, activeFileId } = useAppSelector((state) => state.editor)
	const tabsRef = React.useRef<HTMLDivElement>(null)

	const handleTabClick = (fileId: string) => {
		dispatch(setActiveFile(fileId))
	}

	const handleCloseTab = (e: React.MouseEvent, fileId: string) => {
		e.stopPropagation();
		dispatch(closeFile(fileId))
	}

	const handleMiddleClick = (e: React.MouseEvent, fileId: string) => {
		if (e.button === 1) {
			e.preventDefault();
			dispatch(closeFile(fileId))
		}
	}

	const handleContextMenu = (e: React.MouseEvent, fileId: string) => {
		e.preventDefault()

		// simple context menu implementation
		const menu = document.createElement('div');
		menu.className = `
			fixed z-50 min-w-[160px] py 
			bg-[#3c3c3c] border border-[#454545] 
			shadow-xl rounded-md text-xs
		`;

		menu.style.left = `${e.clientX}px`;
		menu.style.top = `${e.clientY}px`;

		const items: Array<{ label?: string; onClick?: () => void; separator?: boolean }> = [
			{ label: 'Close', onClick: () => dispatch(closeFile(fileId)) },
			{ label: 'Close Others', onClick: () => dispatch(closeOtherFiles(fileId)) },
			{ label: 'Close All', onClick: () => dispatch(closeAllFiles()) },
			{ separator: true },
			{ label: 'Save', onClick: () => dispatch(saveFile(fileId)) }
		];

		items.forEach(item => {
			if (item.separator) {
				const sep = document.createElement('div');
				sep.className = 'my-1 border-t border-[#454545]';
				menu.appendChild(sep)
			} else if (item.label) {
				const btn = document.createElement('button');
				btn.className = 'w-full text-left px-3 py-1.5 hover:bg-accent text-editor-fg';
				btn.textContent = item.label;
				btn.onclick = () => {
					item.onClick?.();
					menu.remove();
				}
				menu.appendChild(btn);
			}
		});

		document.body.appendChild(menu);

		const handleClickOutside = () => {
			menu.remove();
			document.removeEventListener('click', handleClickOutside);
		};

		setTimeout(() => {
			document.addEventListener('click', handleClickOutside)
		}, 0)
	}

	const handleWheel = (e: React.WheelEvent) => {
		if (tabsRef.current) {
			tabsRef.current.scrollLeft += e.deltaY;
		}
	}

	if (openFiles.length === 0) {
		return null;
	}

	return (
		<div
			ref={tabsRef}
			className="
				flex items-stretch h-8.75 min-h-8.75 bg-tab-inactive border-b border-panel-border overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-panel-border scrollbar-track-transparent
			"
			onWheel={handleWheel}
		>{openFiles.map((file) => {
			const isActive = file.id === activeFileId;

			return (
				<div
					key={file.id}
					onClick={() => handleTabClick(file.id)}
					onMouseDown={e => handleMiddleClick(e, file.id)}
					onContextMenu={e => handleContextMenu(e, file.id)}
					className={`
						group flex items-center gap-2 px-3 min-w-30 max-w-50 border-r border-panel-border cursor-pointer transition-colors duration-100 
						${isActive
							? 'bg-tab-active border-t-2 border-t-accent'
							: 'bg-tab-inactive hover:bg-hover border-t-2 border-t-transparent'}
					`}
				>
					{/* File icon */}
					<FileIcon filename={file.filename} size={14} />

					{/* Filename */}
					<span className={`
							flex-1 text-xs truncate ${isActive ? 'text-editor-fg' : 'text-sidebar-fg/70'}
						`}>
						{file.filename}
					</span>

					{/* Dirty indicator / Close button */}
					<div className="flex items-center justify-center w-4 h-4">
						{file.isDirty ? (
							<Circle size={8} className='fill-current text-editor-fg group-hover:hidden' />
						) : null}
						<button
							onClick={e => handleCloseTab(e, file.id)}
						>
							<X size={14} className='text-sidebar-fg/70 hover:text-editor-fg' />
						</button>
					</div>
				</div>
			)
		})}
		</div>
	)
}

export default EditorTabs;