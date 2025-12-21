import type React from 'react';
import { useAppSelector } from '../../hook/useRedux';
import { AlertCircle, AlertTriangle, Bell, CheckCircle2, GitBranch } from 'lucide-react';

const EditorStatusBar: React.FC = () => {
	const { openFiles, activeFileId, settings } = useAppSelector(state => state.editor)
	const activeFile = openFiles.find(f => f.id === activeFileId);

	// Simulation status data
	const errors = 0;
	const warnings = 0;
	const gitBranch = 'main';

	return (
		<div className='flex items-center justify-between h-5.5 px-2 bg-accent text-white text-xxs select-none'>

			{/* Left Section */}
			<div className="flex items-center gap-3">
				<button className="flex items-center gap-1 hover:bg-white/10 px-1.5 py-0.5 rounded">
					<GitBranch size={12} />
					<span>{gitBranch}</span>
				</button>

				{/* Sync status */}
				<button className="flex items-center gap-1 hover:bg-white/10 px-1.5 py-0.5 rounded">
					<CheckCircle2 size={12} />
				</button>

				{/* Problems */}
				<button className="flex items-center gap-2 hover:bg-white/10 px-1.5 py-0.5 rounded">
					<span className="flex items-center gap-1">
						<AlertCircle size={12} />
						<span>{errors}</span>
					</span>
					<span className="flex items-center gap-1">
						<AlertTriangle size={12} />
						<span>{warnings}</span>
					</span>
				</button>
			</div>

			{/* Right Section */}
			<div className="flex items-center gap-3">
				{activeFile && (
					<>
						{/* Cursor Position */}
						<button className="hover:bg-white/10 px-1.5 py-0.5 rounded">
							Ln {activeFile.cursorPosition.line}, Col{' '}
							{activeFile.cursorPosition.column}
						</button>

						{/* Indentation */}
						<button className='hover:bg-white/10 px-1.5 py-0.5 rounded'>
							Spaces: {settings.tabSize}
						</button>

						{/* Encoding */}
						<button className='hover:bg-white/10 px-1.5 py-0.5 rounded'>
							UTF-8
						</button>

						{/* Line Ending */}
						<button className="hover:bg-white/10 px-1.5 py-0.5 rounded">
							LF
						</button>

						{/* Language Mode */}
						<button className="hover:bg-white/10 px-1.5 py-0.5 rounded capitalize">
							{activeFile.language}
						</button>
					</>
				)}

				{/* Notifications */}
				<button className="hover:bg-white/10 px-1.5 py-0.5 rounded">
					<Bell size={12} />
				</button>
			</div>
		</div>
	)
}

export default EditorStatusBar;