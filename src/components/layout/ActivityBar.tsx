import type React from 'react';
import { useAppDispatch, useAppSelector } from '../../hook/useRedux';
import { Files, GitBranch, Icon, Puzzle, Search, Settings, User } from 'lucide-react';
import { setActiveActivityItem, toggleSidebar } from '../../features/workspace/workspaceSlice';

const ActivityBar: React.FC = () => {
	const dispatch = useAppDispatch();
	const { activeActivityItem, isSidebarCollapsed } = useAppSelector(state => state.workspace)

	const topItems = [
		{ id: 'explorer' as const, icon: Files, label: 'Explorer', shortcut: '⌘⇧E' },
		{ id: 'search' as const, icon: Search, label: 'Search', shortcut: '⌘⇧F' },
		{ id: 'git' as const, icon: GitBranch, label: 'Source Control', shortcut: '⌘⇧G' },
		{ id: 'extensions' as const, icon: Puzzle, label: 'Extensions', shortcut: '⌘⇧X' },
	];

	const bottomItems = [
		{ id: 'settings' as const, icon: Settings, label: 'Settings', shortcut: '⌘,' }
	];

	const handleClick = (id: typeof activeActivityItem) => {
		if (activeActivityItem === id && !isSidebarCollapsed) {
			dispatch(toggleSidebar())
		} else {
			dispatch(setActiveActivityItem(id))
		}
	};

	const renderItem = (
		item: { id: typeof activeActivityItem; icon: React.FC<{ size?: number }>; label: string, shortcut: string }
	) => {
		const Icon = item.icon;
		const isActive = activeActivityItem === item.id && !isSidebarCollapsed;

		return (
			<button
				key={item.id}
				onClick={() => handleClick(item.id)}
				className={`
					relative w-12 h-12 flex items-center justify-center 
					transition-colors duration-150 
					${isActive ? 'text-white' : 'text-sidebar-fg/50 hover:text-sidebar-fg'}
					`}
				title={`${item.label} (${item.shortcut})`}
			>
				{/* Active indicator */}
				{isActive && (
					<div className='absolute left-0 top-0 bottom-0 w-0.5 bg-white' />
				)}
				<Icon size={24} />
			</button>
		)
	}

	return (
		<div className='flex flex-col justify-between w-12 border-r min-w-12 bg-activitybar-bg border-panel-border'>
			{/* Top items */}
			<div className="flex flex-col">
				{topItems.map(renderItem)}
			</div>

			{/* Bottom Items */}
			<div className="flex flex-col">
				{bottomItems.map(renderItem)}

				{/* User Avatar */}
				<button
					className='flex items-center justify-center w-12 h-12 text-sidebar-fg/50 hover:text-sidebar-fg'
					title='Account'
				>
					<div className="flex items-center justify-center w-6 h-6 rounded-full bg-accent/30">
						<User size={14} />
					</div>
				</button>
			</div>
		</div>
	)
}

export default ActivityBar;