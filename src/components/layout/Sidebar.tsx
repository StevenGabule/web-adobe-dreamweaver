import { GitBranch, Puzzle } from 'lucide-react';
import type React from 'react';
import { useAppSelector } from '../../hook/useRedux';
import FileExplorer from '../../features/fileExplorer/FileExplorer';

const SearchPanel: React.FC = () => (
	<div className="flex flex-col h-full p-4 bg-sidebar-bg text-sidebar-fg">
		<h2 className="mb-4 text-xs font-medium tracking-wider uppercase">Search</h2>
		<div className="relative">
			<input
				type='text'
				placeholder='Search'
				className='w-full h-6.5 px-2
          bg-editor-bg border border-panel-border
          text-editor-fg text-xs
          placeholder:text-sidebar-fg/40
          focus:border-focus-border focus:outline-none
				'
			/>
		</div>
		<div className="flex items-center justify-center flex-1 text-sm text-sidebar-fg/30">
			Search in files
		</div>
	</div>
)

const GitPanel: React.FC = () => (
	<div className='flex flex-col h-full p-4 bg-sidebar-bg text-sidebar-fg'>
		<h2 className="mb-4 text-xs font-medium tracking-wider uppercase">Source control</h2>
		<div className="flex flex-col items-center justify-center flex-1 text-sm text-sidebar-fg/30">
			<GitBranch size={48} className='mb-4 opacity-30' />
			<p>No source control providers registered</p>
		</div>
	</div>
)

const ExtensionsPanel: React.FC = () => (
	<div className='flex flex-col h-full p-4 bg-sidebar-bg text-sidebar-fg'>
		<h2 className="mb-4 text-xs font-medium tracking-wider uppercase">Extensions</h2>
		<div className="relative mb-4">
			<input
				type='text'
				placeholder='Search Extensions'
				className="
          w-full h-6.5 px-2
          bg-editor-bg border border-panel-border
          text-editor-fg text-xs
          placeholder:text-sidebar-fg/40
          focus:border-focus-border focus:outline-none
        "
			/>
		</div>

		<div className="flex flex-col items-center justify-center flex-1 text-sm text-sidebar-fg/30">
			<Puzzle size={48} className='mb-4 opacity-30' />
			<p>No extensions installed</p>
		</div>
	</div>
)

const SettingsPanel: React.FC = () => (
	<div className='flex flex-col h-full p-4 bg-sidebar-bg text-sidebar-fg'>
		<h2 className="mb-4 text-xs font-medium tracking-wider uppercase">Settings</h2>
		<div className="relative mb-4">
			<input
				type='text'
				placeholder='Search Settings'
				className="
          w-full h-6.5 px-2
          bg-editor-bg border border-panel-border
          text-editor-fg text-xs
          placeholder:text-sidebar-fg/40
          focus:border-focus-border focus:outline-none
        "
			/>
		</div>
		<div className="space-y-4">
			<div className="pb-4 border-b border-panel-border">
				<h3 className="mb-2 text-xs font-medium">Editor</h3>
				<label className="flex items-center justify-between py-1 text-xs">
					<span className="text-sidebar-fg/70">Font Size</span>
					<input
						type='number'
						defaultValue={14}
						className="w-16 h-5.5 px-2 bg-editor-bg border border-panel-border text-editor-fg text-xs"
					/>
				</label>
				<label className="flex items-center justify-between py-1 text-xs">
					<span className="text-sidebar-fg/70">Tab Size</span>
					<input
						type='number'
						defaultValue={2}
						className="w-16 h-5.5 px-2 bg-editor-bg border border-panel-border text-editor-fg text-xs"
					/>
				</label>
				<label className="flex items-center justify-between py-1 text-xs">
					<span className="text-sidebar-fg/70">Word Wrap</span>
					<input type="checkbox" defaultChecked className='accent-accent' />
				</label>
				<label className="flex items-center justify-between py-1 text-xs">
					<span className="text-sidebar-fg/70">Minimap</span>
					<input type="checkbox" defaultChecked className='accent-accent' />
				</label>
			</div>
			<div>
				<h3 className="mb-2 text-xs font-medium">Theme</h3>
				<select className='w-full h-6.5 px-2
          bg-editor-bg border border-panel-border
          text-editor-fg text-xs'>
					<option value="vs-dark">Dark+ (default dark)</option>
					<option value="vs-light">Light+ (default light)</option>
					<option value="hc-black">High Contrast</option>
				</select>
			</div>
		</div>
	</div>
)

const Sidebar: React.FC = () => {
	const { activeActivityItem, isSidebarCollapsed, sidebarWidth } = useAppSelector(state => state.workspace)

	if (isSidebarCollapsed) {
		return null;
	}

	const renderPanel = () => {
		switch (activeActivityItem) {
			case 'explorer':
				return <FileExplorer />
			case 'search':
				return <SearchPanel />
			case 'git':
				return <GitPanel />
			case 'extensions':
				return <ExtensionsPanel />
			case 'settings':
				return <SettingsPanel />
			default:
				return <FileExplorer />
		}
	};

	return (
		<div
			className='h-full overflow-hidden border-r border-panel-border'
			style={{ width: sidebarWidth }}
		>
			{renderPanel()}
		</div>
	)
}

export default Sidebar;