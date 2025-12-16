import type React from 'react';
import { useAppSelector } from '../../hook/useRedux';
import { Menu, Minus, Square, X } from 'lucide-react';

const TitleBar: React.FC = () => {
	const { currentProject } = useAppSelector(state => state.project);
	const { openFiles, activeFileId } = useAppSelector(state => state.editor)
	const activeFile = openFiles.find(f => f.id === activeFileId);

	// Build title
	const parts = [];
	if (activeFile) {
		parts.push(activeFile.isDirty ? `● ${activeFile.filename}` : activeFile.filename)
	}

	if (currentProject) {
		parts.push(currentProject.name)
	}

	parts.push('Dreamweaver')

	const title = parts.join(' - ');

	const menuItems = [
		{
			label: 'File',
			items: ['New File', 'New Window', 'Open File...', 'Open Folder', 'Save', 'Save As...', 'Exit']
		},
		{
			label: 'Edit',
			items: ['Undo', 'Redo', 'Cut', 'Copy', 'Paste', 'Find', 'Replace']
		},
		{
			label: 'View',
			items: ['Command Palette', 'Explorer', 'Search', 'Source Control', 'Extensions', 'Terminal']
		},
		{
			label: 'Help',
			items: ['Documentation', 'Release Notes', 'About']
		},
	];

	return (
		<div className='flex items-center h-7.5 bg-titlebar-bg border-b border-panel-border select-none app-drag'>
			{/* Menu Button (for when in browser) */}
			<button className='flex items-center justify-center w-12 h-full hover:bg-hover app-no-drag'>
				<Menu size={14} className='text-sidebar-fg/70' />
			</button>

			{/* Menu Items */}
			<div className="flex items-center gap-2 app-no-drag">
				{menuItems.map((menu) => (
					<div key={menu.label} className='relative group'>
						<button className='px-3 h-7.5 text-xs text-sidebar-fg/90 hover:bg-hover'>{menu.label}</button>

						{/* Dropdown (simple hover implementation) */}
						<div className='hidden group-hover:block absolute top-full left-0 z-50 min-w-50 py-1 bg-[#3c3c3c] border border-[#454545] shadow-xl rounded-b-md'>
							{menu.items.map((item, idx) => (
								<button key={idx} className='w-full px-4 py-1.5 text-left text-xs text-editor-fg hover:bg-red'>
									{item}
								</button>
							))}
						</div>
					</div>
				))}
			</div>

			{/* Title (centered) */}
			<div className="flex items-center justify-center flex-1">
				<span className="text-xs truncate text-sidebar-fg/70 max-w-100">
					{title}
				</span>
			</div>

			{/* Window Controls (for electron like experience) */}
			<div className="flex items-center app-no-drag">
				<button className='w-12 h-7.5 flex items-center justify-center hover:bg-hover'>
					<Minus size={14} className='text-sidebar-fg/70' />
				</button>
				<button className='w-12 h-7.5 flex items-center justify-center hover:bg-hover'>
					<Square size={12} className='text-sidebar-fg/70' />
				</button>
				<button className='w-12 h-7.5 flex items-center justify-center hover:bg-[#e81123]'>
					<X size={14} className='text-sidebar-fg/70 hover:text-white' />
				</button>
			</div>
		</div>
	)
}

export default TitleBar;