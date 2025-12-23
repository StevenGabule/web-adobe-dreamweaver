import React, { useEffect, useState } from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { useAppDispatch, useAppSelector } from '../../hook/useRedux'
import TitleBar from './TitleBar'
import ActivityBar from './ActivityBar'
import Sidebar from './Sidebar'
import EditorPane from '../../features/editor/EditorPane'
import { openSearch } from '../../features/search/searchSlice'
import { togglePreview } from '../../features/preview/previewSlice'
import { toggleCSSDesigner } from '../../features/cssDesigner/cssDesignerSlice'
import { toggleProperties } from '../../features/properties/propertiesSlice'
import Toolbar from '../../features/toolbar/Toolbar'
import FindReplace from '../../features/search/FindReplace'
import LivePreview from '../../features/preview/LivePreview'
import CSSDesigner from '../../features/cssDesigner/CSSDesigner'
import PropertiesPanel from '../../features/properties/PropertiesPanel'

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
	const dispatch = useAppDispatch();
	const { isSidebarCollapsed, isPanelCollapsed } = useAppSelector(state => state.workspace)
	const { isPanelVisible: isPreviewVisible } = useAppSelector(s => s.preview)
	const { isOpen: isSearchOpen } = useAppSelector(s => s.search)
	const { isVisible: isCSSDesignerVisible } = useAppSelector(s => s.cssDesigner)
	const { isVisible: isPropertiesVisible } = useAppSelector(s => s.properties)

	// Check if right panel should be visible
	const isRightPanelVisible = isCSSDesignerVisible || isPropertiesVisible;

	// Track action right panel tab
	const [rightPanelTab, setRightPanelTab] = useState<'css' | 'properties'>('css')

	// Keyboard shortcuts
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// Ctrl+F or Cmd+F for Find
			if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
				e.preventDefault();
				dispatch(openSearch())
			}

			// Ctrl+H or Cmd+H for replace
			if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'p') {
				e.preventDefault();
				dispatch(togglePreview());
			}

			// Ctrl+Shift+P for preview
			if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'p') {
				e.preventDefault();
				dispatch(togglePreview());
			}

			// Ctrl+Shift+C for CSS Designer
			if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'c') {
				e.preventDefault();
				dispatch(toggleCSSDesigner());
			}

			// Ctrl+Shift+I for Properties
			if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'i') {
				e.preventDefault();
				dispatch(toggleProperties());
			}
		}

		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown)
	}, [dispatch])

	return (
		<div className='flex flex-col w-screen h-screen overflow-hidden bg-editor-bg'>
			{/* Title Bar */}
			<TitleBar />

			{/* Toolbar */}
			<Toolbar />

			{/* Main Content Area */}
			<div className="relative flex flex-1 overflow-hidden">
				{/* Activity Bar */}
				<ActivityBar />

				{/* Main Panel Group */}
				<PanelGroup direction='horizontal' className='flex-1'>
					{/* Left Sidebar */}
					{!isSidebarCollapsed && (
						<>
							<Panel
								defaultSize={20}
								minSize={15}
								maxSize={40}
								className='bg-sidebar-bg'>
								<Sidebar />
							</Panel>
							<ResizeHandle direction='horizontal' />
						</>
					)}

					{/* Center: Editor + Preview Area */}
					<Panel defaultSize={isRightPanelVisible ? 60 : (isSidebarCollapsed ? 100 : 80)} minSize={30}>
						<PanelGroup direction='vertical'>
							{/* Editor + Preview Horizontal Split */}
							<Panel defaultSize={isPanelCollapsed ? 100 : 70} minSize={30}>
								<div className="relative flex flex-col h-full">
									{/* Find & Replace Overlay*/}
									{isSearchOpen && <FindReplace />}

									{/* Editor + Preview */}
									{isPreviewVisible ? (
										<PanelGroup direction='horizontal' className='flex-1'>
											<Panel defaultSize={50} minSize={20}>
												<EditorPane />
											</Panel>
											<ResizeHandle direction='horizontal' />
											<Panel defaultSize={50} minSize={20}>
												<LivePreview />
											</Panel>
										</PanelGroup>
									) : (
										<div className="flex-1">
											<EditorPane />
										</div>
									)}
								</div>
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

					{/* Right Panel: CSS Designer + Properties */}
					{isRightPanelVisible && (
						<>
							<ResizeHandle direction='horizontal' />
							<Panel>
								<RightPanel
									activeTab={rightPanelTab}
									onTabChange={setRightPanelTab}
									showCSSDesigner={isCSSDesignerVisible}
									showProperties={isPropertiesVisible}
								/>
							</Panel>
						</>
					)}
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
		{ id: 'debug' as const, label: 'Debug Console' },
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
						<p>Welcome to IDE Clone terminal</p>
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

const RightPanel: React.FC<{
	activeTab: 'css' | 'properties';
	onTabChange: (tab: 'css' | 'properties') => void;
	showCSSDesigner: boolean;
	showProperties: boolean;
}> = ({ activeTab, onTabChange, showCSSDesigner, showProperties }) => {
	// Determine which tab to show
	const effectiveTab = activeTab === 'css' && !showCSSDesigner
		? 'properties'
		: activeTab === 'properties' && !showProperties
			? 'css'
			: activeTab;
	return (
		<div className='flex flex-col h-full border-l bg-sidebar-bg border-panel-border'>
			{/* Tab Headers */}
			{showCSSDesigner && showProperties && (
				<div className='flex border-b border-panel-border'>
					<button
						onClick={() => onTabChange('css')}
						className={`flex-1 px-3 py-2 text-xs border-b-2 transition-colors ${effectiveTab === 'css' ? 'text-editor-fg border-accent' : 'text-sidebar-fg/50 border-transparent hover:text-sidebar-fg'}`}
					>
						CSS Designer
					</button>
					<button
						onClick={() => onTabChange('properties')}
						className={`flex-1 px-3 py-2 text-xs border-b-2 transition-colors ${effectiveTab === 'properties' ? 'text-editor-fg border-accent' : 'text-sidebar-fg/50 border-transparent hover:text-sidebar-fg'}`}
					>
						Properties
					</button>
				</div>
			)}

			{/* Panel Content */}
			<div className="flex-1 overflow-hidden">
				{effectiveTab === 'css' && showCSSDesigner && <CSSDesigner />}
				{effectiveTab === 'properties' && showProperties && <PropertiesPanel />}
			</div>
		</div>
	)
}

export default MainLayout