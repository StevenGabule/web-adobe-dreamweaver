import React from 'react';
import { useAppDispatch, useAppSelector } from '../../hook/useRedux';
import type { editor } from 'monaco-editor'
import { saveFile, setViewState, updateCursorPosition, updateFileContent } from './editorSlice';
import { Editor, type OnChange, type OnMount } from '@monaco-editor/react';

interface MonacoEditorProps {
	fileId: string;
}

const MonacoEditor: React.FC<MonacoEditorProps> = ({ fileId }) => {
	const dispatch = useAppDispatch()
	const editorRef = React.useRef<editor.IStandaloneCodeEditor | null>(null)

	const file = useAppSelector((state) => state.editor.openFiles.find(f => f.id === fileId))
	const settings = useAppSelector((state) => state.editor.settings);

	const handleEditorDidAmount: OnMount = React.useCallback(
		(editor, monaco) => {
			editorRef.current = editor;

			// Restore view state if available
			if (file?.viewState) {
				editor.restoreViewState(file.viewState as editor.ICodeEditorViewState)
			}

			// Focus the editor
			editor.focus();

			// Add keyboard shortcuts
			editor.addCommand(monaco.keyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
				dispatch(saveFile(fileId))
			});

			// Track cursor position
			editor.onDidChangeCursorPosition((e) => {
				dispatch(
					updateCursorPosition({
						fileId,
						position: {
							line: e.position.lineNumber,
							column: e.position.column
						}
					})
				)
			});

			// save view state on blur
			editor.onDidBlurEditorWidget(() => {
				const viewState = editor.saveViewState();
				if (viewState) {
					dispatch(setViewState({ fileId, viewState }))
				}
			});

			// Configure editor features
			monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
				noSemanticValidation: false,
				noSyntaxValidation: false,
			});

			monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
				target: monaco.languages.typescript.ScriptTarget.ESNext,
				allowNonTsExtensions: true,
				moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
				module: monaco.languages.typescript.ModuleKind.ESNext,
				noEmit: true,
				esModuleInterop: true,
				jsx: monaco.languages.typescript.JsxEmit.React,
				reactNamespace: 'React',
				allowJs: true,
				typeRoots: ['node_modules/@types']
			});

			// Add emmet support placeholder (would need separate library)
			// For now, just enable HTML tag auto-closing
			if (file?.language === 'html') {
				monaco.languages.registerCompletionItemProvider('html', {
					triggerCharacters: ['>'],
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					provideCompletionItems: (model: any, position: any) => {
						const textUntilPosition = model.getValueInRange({
							startLineNumber: position.lineNumber,
							startColumn: 1,
							endLineNumber: position.lineNumber,
							endColumn: position.column
						});

						// Simple tag detection for auto-closing
						const tagMatch = textUntilPosition.match(/<(\w+)(?:\s[^>]*)?>$/);
						if (tagMatch) {
							const tagName = tagMatch[1];
							const voidElements = ['br', 'hr', 'img', 'input', 'meta', 'link', 'area', 'base', 'col', 'embed', 'param', 'source', 'track', 'wbr'];

							if (!voidElements.includes(tagName.toLowerCase())) {
								return {
									suggestions: [
										{
											label: `</${tagName}>`,
											kind: monaco.language.CompletionItemKind.Snippet,
											insertText: `$0</${tagName}`,
											range: {
												startLineNumber: position.lineNumber,
												startColumn: position.column,
												endLineNumber: position.lineNumber,
												endColumn: position.column
											}
										}
									]
								}
							}
						}

						return {
							suggestions: []
						}
					}
				})
			}
		}, [fileId, file?.viewState, file?.language, dispatch])

	const handleChange: OnChange = React.useCallback((value) => {
		if (value !== undefined) {
			dispatch(updateFileContent({ fileId, content: value }))
		}
	}, [fileId, dispatch])

	if (!file) {
		return (
			<div className='flex items-center justify-center h-full bg-editor-bg text-editor-fg/50'>
				File not found.
			</div>
		)
	}

	return (
		<Editor
			height={'100%'}
			language={file.language}
			value={file.content}
			theme={settings.theme}
			onChange={handleChange}
			onMount={handleEditorDidAmount}
			options={{
				fontSize: settings.fontSize,
				fontFamily: settings.fontFamily,
				tabSize: settings.tabSize,
				wordWrap: settings.wordWrap,
				minimap: { enabled: settings.minimap },
				lineNumbers: settings.lineNumbers,
				renderWhitespace: settings.renderWhitespace,
				formatOnPaste: settings.formatOnPaste,
				automaticLayout: true,
				scrollBeyondLastLine: false,
				smoothScrolling: true,
				cursorBlinking: 'smooth',
				cursorSmoothCaretAnimation: 'on',
				bracketPairColorization: { enabled: true },
				guides: {
					bracketPairs: true,
					indentation: true,
				},
				padding: { top: 8 },
				folding: true,
				foldingStrategy: 'indentation',
				showFoldingControls: 'mouseover',
				matchBrackets: 'always',
				autoClosingBrackets: 'always',
				autoClosingQuotes: 'always',
				autoSurround: 'languageDefined',
				suggest: {
					showKeywords: true,
					showSnippets: true,
					showClasses: true,
					showFunctions: true,
					showVariables: true,
				},
				quickSuggestions: {
					other: true,
					comments: false,
					strings: true
				}
			}}

			loading={
				<div className='flex items-center justify-center h-full bg-editor-bg'>
					<div className="flex flex-col items-center gap-3">
						<div className="w-8 h-8 border-2 rounded-full border-accent border-t-transparent animate-spin" />
						<span className="text-sm text-sidebar-fg/50">Loading editor...</span>
					</div>
				</div>
			}
		/>
	)
}

export default MonacoEditor;