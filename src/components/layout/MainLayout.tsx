import React from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { useAppSelector } from '../../hook/useRedux'
import TitleBar from './TitleBar'
import ActivityBar from './ActivityBar'
import Sidebar from './Sidebar'
import EditorPane from '../../features/editor/EditorPane'

const ResizeHandle: React.FC<{ direction?: 'horizontal' | 'vertical' }> = ({ direction = 'horizontal' }) => (
	<PanelResizeHandle
		className={`group relative ${direction === 'horizontal' ? 'w-1 hover:w-1' : 'h-1 hover:h-1'} bg-transparent hover:bg-accent/50 transition-colors duration-150`}>
		<div
			className={`
				absolute bg-panel-border group-hover:bg-accent transition-colors duration-150 
				${direction === 'horizontal' ? 'left-0 top-0 bottom-0 w-px' : 'top-0 left-0 right-0 h-px'}`}
		/>
	</PanelResizeHandle>
)

const MainLayout: React.FC = () => {
	const { isSidebarCollapsed, isPanelCollapsed } = useAppSelector(state => state.workspace)

	return (
		<div className='flex flex-col w-screen h-screen overflow-hidden bg-editor-bg'>
			{/* Title Bar */}
			<TitleBar />

			{/* Main Content Area */}
			<div className="flex flex-1 overflow-hidden">
				{/* Activity Bar */}
				<ActivityBar />

				{/* Main Panel Group */}
				<PanelGroup direction='horizontal' className='flex-1'>
					{!isSidebarCollapsed && (
						<>
							<Panel defaultSize={20} minSize={15} maxSize={40} className='bg-sidebar-bg'>
								<Sidebar />
							</Panel>
							<ResizeHandle direction='horizontal' />
						</>
					)}

					{/* Editor Area */}
					<Panel defaultSize={isSidebarCollapsed ? 100 : 80} minSize={30}>
						<PanelGroup direction='vertical'>
							{/* Editor */}
							<Panel defaultSize={isPanelCollapsed ? 100 : 70} minSize={30}>
								<EditorPane />
							</Panel>

							{/* Bottom Panel (Terminal, Problems, etc.) */}
							{!isPanelCollapsed && (
								<>
									<ResizeHandle direction='vertical' />
									<Panel defaultSize={30} minSize={10} maxSize={50}>
										<BottomPanel />
									</Panel>
								</>
							)}
						</PanelGroup>
					</Panel>
				</PanelGroup>
			</div>
		</div>
	)
}

const BottomPanel: React.FC = () => {
	const [activeTab, setActiveTab] = React.useState<'problems' | 'output' | 'terminal' | 'debug'>('terminal');

	const tabs = [
		{ id: 'problems' as const, label: 'Problems', count: 0 },
		{ id: 'output' as const, label: 'Output' },
		{ id: 'terminal' as const, label: 'Terminal' },
		{ id: 'debug' as const, label: 'Debug' },
	]

	return (
		<div className='flex flex-col h-full border-t bg-panel-bg border-panel-border'>
			{/* Panel Header */}
			<div className="flex items-center px-2 border-b border-panel-border h-8.75">
				<div className="flex items-center gap-0">
					{tabs.map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={`px-3 py-1.5 text-xs uppercase tracking-wider border-b-2 transition-colors ${activeTab === tab.id ? 'text-editor-fg border-accent' : 'text-sidebar-fg/50 border-transparent hover:text-sidebar-fg'}`}
						>
							{tab.label}
							{tab.count !== undefined && (
								<span className='mb-1.5 px-1.5 py-0.5 bg-panel-border rounded-full text-xxs'>
									{tab.count}
								</span>
							)}
						</button>
					))}
				</div>
			</div>

			{/* Panel Content */}
			<div className="flex-1 p-2 overflow-auto font-mono text-xs">
				{activeTab === 'terminal' && (
					<div className='text-success'>
						<p>Welcome to Dreamweaver Clone terminal</p>
						<p className="text-sidebar-fg/50">$ _</p>
					</div>
				)}

				{activeTab === 'problems' && (
					<div className='py-8 text-center text-sidebar-fg/50'>
						No problems detected
					</div>
				)}

				{activeTab === 'output' && (
					<div className='py-8 text-center text-sidebar-fg/50'>
						No output
					</div>
				)}

				{activeTab === 'debug' && (
					<div className='py-8 text-center text-sidebar-fg/50'>
						Debug console is empty
					</div>
				)}
			</div>
		</div>
	)
}

export default MainLayout