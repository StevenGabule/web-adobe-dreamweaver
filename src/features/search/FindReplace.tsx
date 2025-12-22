import { useCallback, useEffect, useRef, type FC } from 'react'
import { useAppDispatch, useAppSelector } from '../../hook/useRedux'
import { addToSearchHistory, clearMatches, closeSearch, nextMatch, previousMatch, setActiveTab, setFileMatches, setReplaceQuery, setSearchQuery, toggleCaseSensitive, toggleRegex } from './searchSlice';
import { updateFileContent } from '../editor/editorSlice';
import { CaseSensitive, ChevronRight, ChevronUp, FileSearch, Replace, ReplaceAll, Search, WholeWord, X } from 'lucide-react';

const FindReplace: FC = () => {
	const dispatch = useAppDispatch();
	const searchInputRef = useRef<HTMLInputElement>(null);
	const replaceInputRef = useRef<HTMLInputElement>(null);

	const {
		isOpen,
		activeTab,
		searchQuery,
		replaceQuery,
		caseSensitive,
		wholeWord,
		useRegex,
		currentMatchIndex,
		totalMatches,
		fileMatches
	} = useAppSelector(s => s.search);

	const { openFiles, activeFileId } = useAppSelector(s => s.editor);
	const activeFile = openFiles.find(f => f.id === activeFileId);

	// Focus search input when opened
	useEffect(() => {
		if (isOpen && searchInputRef.current) {
			searchInputRef.current.focus();
			searchInputRef.current.select();
		}
	}, [isOpen])

	// Search in current file
	const performSearch = useCallback(() => {
		if (!activeFile || !searchQuery) {
			dispatch(clearMatches());
			return;
		}

		const content = activeFile.content;
		const lines = content.split("\n");
		const matches: Array<{ line: number; column: number; length: number }> = [];

		try {
			let searchPattern: RegExp;

			if (useRegex) {
				searchPattern = new RegExp(searchQuery, caseSensitive ? 'g' : 'gi');
			} else {
				let escapedQuery = searchQuery.replace(/[.*+^${}()|[\]\\]/g, '\\$&');
				if (wholeWord) {
					escapedQuery = `\\b${escapedQuery}\\b`
				}
				searchPattern = new RegExp(escapedQuery, caseSensitive ? 'g' : 'gi');
			}

			lines.forEach((line, lineIndex) => {
				let match;
				while ((match = searchPattern.exec(line)) !== null) {
					matches.push({
						line: lineIndex + 1,
						column: match.index + 1,
						length: match[0].length
					})
				}
			});

			dispatch(setFileMatches({ fileId: activeFile.id, matches }))
		} catch {
			// invalid regex
			dispatch(clearMatches())
		}
	}, [activeFile, searchQuery, caseSensitive, wholeWord, useRegex, dispatch])

	// Search when query or options change
	useEffect(() => {
		const timer = setTimeout(() => {
			if (searchQuery) {
				performSearch();
			} else {
				dispatch(clearMatches())
			}
		}, 150);

		return () => clearTimeout(timer);
	}, [searchQuery, caseSensitive, wholeWord, useRegex, performSearch, dispatch])

	// Handle keyboard shortcuts
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!isOpen) return;

			if (e.key === 'Escape') {
				dispatch(closeSearch());
			} else if (e.key === 'Enter') {
				if (e.shiftKey) {
					dispatch(previousMatch())
				} else {
					dispatch(nextMatch())
				}
			} else if (e.key === 'F3') {
				e.preventDefault()
				if (e.shiftKey) {
					dispatch(previousMatch())
				} else {
					dispatch(nextMatch())
				}
			}
		};

		document.addEventListener('keydown', handleKeyDown);

		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [isOpen, dispatch])

	// Replace current match
	const handleReplace = () => {
		if (!activeFile || !fileMatches || currentMatchIndex < 0) return;

		const match = fileMatches.matches[currentMatchIndex];

		if (!match) return;

		const lines = activeFile.content.split('\n');
		const line = lines[match.line - 1];

		const newLine = line.substring(0, match.column - 1) + replaceQuery + line.substring(match.column - 1 + match.length);
		lines[match.line - 1] = newLine;

		dispatch(
			updateFileContent({
				fileId: activeFile.id,
				content: lines.join("\n")
			})
		);

		dispatch(addToSearchHistory(searchQuery));

		// Re-search after replace
		setTimeout(performSearch, 50);
	}

	// Replace all matches
	const handleReplaceAll = () => {
		if (!activeFile || !searchQuery) return;

		let content = activeFile.content;

		try {
			let searchPattern: RegExp;

			if (useRegex) {
				searchPattern = new RegExp(searchQuery, caseSensitive ? 'g' : 'gi');
			} else {
				let escapedQuery = searchQuery.replace(/[.*+?${}()|[\]\\]/g, '\\$&');
				if (wholeWord) {
					escapedQuery = `\\b${escapedQuery}\\b`;
				}

				searchPattern = new RegExp(escapedQuery, caseSensitive ? 'g' : 'gi');
			}

			content = content.replace(searchPattern, replaceQuery);
			dispatch(updateFileContent({ fileId: activeFile.id, content }))
			dispatch(addToSearchHistory(searchQuery));
			dispatch(clearMatches())
		} catch {
			// invalid regex
		}
	}

	if (!isOpen) return null;

	const showReplace = activeTab === 'replace';

	return (
		<div className='absolute top-0 z-40 right-4 animate-slide-in'>
			<div className="border rounded-b-lg shadow-xl overflow-hidden bg-[#3c3c3c] border-[#454545]">
				{/* Header with tabs */}
				<div className="flex items-center justify-between px-2 py-1 border-b border-[#454545]">
					<div className="flex items-center gap-1">
						<button
							onClick={() => dispatch(setActiveTab('find'))}
							className={`px-2 py-1 text-xs rounded ${activeTab === 'find'
								? 'bg-accent text-white'
								: 'text-sidebar-fg/70 hover:bg-hover'
								}`}
						>
							<Search size={14} />
						</button>
						<button
							onClick={() => dispatch(setActiveTab('replace'))}
							className={`px-2 py-1 text-xs rounded ${activeTab === 'replace'
								? 'bg-accent text-white'
								: 'text-sidebar-fg/70 hover:bg-hover'
								}`}
						>
							<Replace size={14} />
						</button>
						<button
							onClick={() => dispatch(setActiveTab('findInFiles'))}
							className={`px-2 py-1 text-xs rounded ${activeTab === 'findInFiles'
								? 'bg-accent text-white'
								: 'text-sidebar-fg/70 hover:bg-hover'
								}`}
							title="Find in Files"
						>
							<FileSearch size={14} />
						</button>
					</div>
					<button
						onClick={() => dispatch(closeSearch())}
						className='p-1 rounded hover:bg-hover'
					>
						<X size={14} className='text-sidebar-fg/70' />
					</button>
				</div>
				{/* Search input row */}
				<div className="p-2 space-y-2">
					<div className="flex items-center gap-2">
						{/* Toggle Expand(for replace) */}
						<button
							onClick={() => dispatch(setActiveTab(showReplace ? 'find' : 'replace'))}
							className='p-1 rounded hover:bg-hover'
						>
							<ChevronRight
								size={14}
								className={`text-sidebar-fg/70 transition-transform ${showReplace ? 'rotate-90' : ''
									}`}
							/>
						</button>
						{/* Search input */}
						<div className="relative flex-1">
							<input
								ref={searchInputRef}
								type='text'
								value={searchQuery}
								onChange={e => dispatch(setSearchQuery(e.target.value))}
								placeholder='Find'
								className='
									w-full h-6.5 px-2 pr-20 
									bg-editor-bg border border-panel-border 
									text-editor-fg text-xs 
									placeholder:text-sidebar-fg/40 
									focus:border-focus-border focus:outline-none
								'
							/>

							{/* Option Buttons */}
							<div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
								<button
									onClick={() => dispatch(toggleCaseSensitive())}
									className={`p-1 rounded ${caseSensitive ? 'bg-accent text-white' : 'hover:bg-hover'
										}`}
									title='Match Case (Alt+C)'
								>
									<CaseSensitive size={14} />
								</button>
								<button
									onClick={() => dispatch(toggleRegex())}
									className={`p-1 rounded ${useRegex ? 'bg-accent text-white' : 'hover:bg-hover'
										}`}
									title="Use regular expression (Alt+R)"
								>
									<WholeWord size={14} />
								</button>
							</div>
						</div>

						{/* Match Count & Navigation */}
						<div className="flex items-center gap-1">
							<span className="text-xs text-center text-sidebar-fg/50 min-w-15">
								{totalMatches > 0
									? `${currentMatchIndex + 1} of ${totalMatches}`
									: searchQuery
										? 'No results'
										: ''}
							</span>
							<button
								onClick={() => dispatch(nextMatch())}
								disabled={totalMatches === 0}
								className='p-1 rounded hover:bg-hover disabled:opacity-30'
								title="Next Match (Enter)"
							>
								<ChevronUp size={14} className='text-sidebar-fg/70' />
							</button>
						</div>

						{/* Replace Input Row */}
						{showReplace && (
							<div className='flex items-center gap-2 pl-6'>
								<div className="flex-1">
									<input
										ref={replaceInputRef}
										type='text'
										value={replaceQuery}
										onChange={e => dispatch(setReplaceQuery(e.target.value))}
										placeholder='Replace'
										className='w-full h-6.5 bg-editor-bg border border-panel-border text-editor-bg- text-xs placeholder:text-sidebar-fg/40 focus:border-focus-border focus:outline-none'
									/>
								</div>

								{/* Replace Buttons */}
								<div className="flex items-center gap-1">
									<button
										onClick={handleReplace}
										disabled={totalMatches === 0}
										className='p-1.5 hover:bg-hover rounded disabled:opacity-30'
										title="Replace (Ctrl+Shift+1)"
									>
										<Replace size={14} className='text-sidebar-fg/70' />
									</button>
									<button
										onClick={handleReplaceAll}
										disabled={totalMatches === 0}
										className='p-1.5 hover:bg-hover rounded disabled:opacity-30'
										title="Replace All (Ctrl+Shift+Enter)"
									>
										<ReplaceAll size={14} className='text-sidebar-fg/70' />
									</button>
								</div>
							</div>
						)}

						{/* Find in files Options */}
						{activeTab === 'findInFiles' && (
							<div className='space-y-2 pt-2 border-t border-[#454545]'>
								<div className="uppercase text-xxs text-sidebar-fg/50">Files to include</div>
								<input
									type='text'
									placeholder='e.g., *.js, *.tsx, src/**'
									className='w-full h-6.5 px-2 bg-editor-bg border border-panel-border text-editor-fg text-xs placeholder:text-sidebar-fg/40 focus:border-focus-border focus:outline-none'
								/>
								<div className="uppercase text-xxs text-sidebar-fg/50">Files to exclude</div>
								<input
									type='text'
									placeholder='e.g., node_modules, dist'
									defaultValue={'node_modules, .git, dist'}
									className='w-full h-6.5 px-2 bg-editor-bg border border-panel-border text-editor-fg text-xs placeholder:text-sidebar-fg/40 focus:border-focus-border focus:outline-none'
								/>
							</div>
						)}
					</div>

					{/* Results Preview (for find in Files) */}
					{activeTab === 'findInFiles' && totalMatches > 0 && (
						<div className='max-h-50 overflow-auto border-t border-[#454545]'>
							<div className='p-2 text-xs text-sidebar-fg/50'>
								{totalMatches} results in {totalMatches} files
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default FindReplace