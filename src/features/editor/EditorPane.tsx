import type React from 'react';
import { useAppDispatch, useAppSelector } from '../../hook/useRedux';
import { Code2, Columns, FileCode, Rows } from 'lucide-react';
import { setSplitMode } from './editorSlice';
import EditorTabs from './EditorTabs';
import MonacoEditor from './MonacoEditor';
import EditorStatusBar from './EditorStatusBar';

const EditorPane: React.FC = () => {
	const dispatch = useAppDispatch();
	const { openFiles, activeFileId, splitMode, secondaryActiveFileId } = useAppSelector(state => state.editor)

	// Empty state when no files are open
	if (openFiles.length === 0) {
		return (
			<div className='flex flex-col h-full bg-editor-bg'>
				<div className="flex items-center justify-center flex-1">
					<div className="text-center">
						<div className="flex justify-center mb-6">
							<div className="flex items-center justify-center w-24 h-24 rounded-2xl bg-linear-to-br from-accent/20 to-purple-500/20">
								<Code2 size={48} className='text-accent/50' />
							</div>
						</div>
						<h2 className="mb-2 text-xl font-light text-editor-fg/70">
							Dreamweaver Clone
						</h2>
						<p className="max-w-md mb-8 text-sm text-sidebar-fg/50">
							Open a file from the explorer to start editing, or create a new file.
						</p>

						{/* Quick Actions */}
						<div className="flex flex-col items-center gap-3 text-sm">
							<div className="flex items-center gap-2 text-sidebar-fg/50">
								<span className="px-2 py-0.5 bg-[#3c3c3c] rounded text-xxs font-mono">
									Ctrl+N
								</span>
								<span>New File</span>
							</div>

							<div className="flex items-center gap-2 text-sidebar-fg/50">
								<span className="px-2 py-0.5 bg-[#3c3c3c] rounded text-xxs font-mono">
									Ctrl+O
								</span>
								<span>Open File</span>
							</div>

							<div className="flex items-center gap-2 text-sidebar-fg/50">
								<span className="px-2 py-0.5 bg-[#3c3c3c] rounded text-xxs font-mono">
									Ctrl+P
								</span>
								<span>Quick Open</span>
							</div>
						</div>

						{/* Recent Files Section (placeholder) */}
						<div className="mt-10">
							<h3 className="mb-3 text-xs font-medium tracking-wider uppercase text-sidebar-fg/40">Recent Files</h3>
							<div className="flex flex-col items-center gap-1 text-sm text-sidebar-fg/30">
								<span>
									No recent files
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className='flex flex-col h-full bg-editor-bg'>
			{/* Editor Toolbar */}
			<div className="flex items-center justify-between border-b bg-titlebar-bg border-panel-border">
				<EditorTabs />

				{/* Split view controls */}
				<div className="flex items-center gap-1 px-2">
					<button
						onClick={() => dispatch(setSplitMode('none'))}
						className={`p-1.5 rounded ${splitMode === 'none' ? 'bg-accent' : 'hover:bg-hover'}`}
						title='Single Editor'
					>
						<FileCode size={14} className='text-editor-fg/70' />
					</button>
					<button
						onClick={() => dispatch(setSplitMode('vertical'))}
						className={`p-1.5 rounded ${splitMode === 'vertical' ? 'bg-accent' : 'hover:bg-hover'}`}
						title='Split Vertically'
					>
						<Columns size={14} className='text-editor-fg/70' />
					</button>
					<button
						onClick={() => dispatch(setSplitMode('horizontal'))}
						className={`p-1.5 rounded ${splitMode === 'horizontal' ? 'bg-accent' : 'hover:bg-hover'}`}
						title='Split Horizontal'
					>
						<Rows size={14} className='text-editor-fg/70' />
					</button>
				</div>
			</div>

			{/* Editor content */}
			<div className="flex-1 overflow-hidden">
				{splitMode === 'none' ? (
					// Single Editor
					activeFileId && <MonacoEditor fileId={activeFileId} />
				) : splitMode === 'vertical' ? (
					// Vertical split(side by side)
					<div className='flex h-full'>
						<div className="flex-1 border-r border-panel-border">
							{activeFileId && <MonacoEditor fileId={activeFileId} />}
						</div>
						<div className="flex-1">
							{secondaryActiveFileId ? (
								<MonacoEditor fileId={secondaryActiveFileId} />
							) : (
								<div className='flex items-center justify-center h-full text-sm text-sidebar-fg/30'>
									Open a file in this pane
								</div>
							)}
						</div>
					</div>
				) : (
					// Horizontal split (stacked)
					<div className='flex flex-col h-full'>
						<div className="flex-1 border-b border-panel-border">
							{activeFileId && <MonacoEditor fileId={activeFileId} />}
						</div>
						<div className="flex-1">
							{secondaryActiveFileId ? (
								<MonacoEditor fileId={secondaryActiveFileId} />
							) : (
								<div className='flex items-center justify-center h-full text-sm text-sidebar-fg/30'>
									Open a file in this pane.
								</div>
							)}
						</div>
					</div>
				)}
			</div>

			{/* Status Bar */}
			<EditorStatusBar />
		</div>
	)
}

export default EditorPane;