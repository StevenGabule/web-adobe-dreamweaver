import { useEffect, useMemo, useRef, useState, type FC } from 'react'
import { useAppDispatch, useAppSelector } from '../../hook/useRedux'
import { clearConsole, devicePresets, refresh, resetZoom, rotateDevice, selectDevice, setLoading, toggleConsole, zoomIn, zoomOut } from './previewSlice';
import { ChevronDown, ExternalLink, Maximize2, Monitor, Pause, Play, RefreshCcw, RefreshCw, RotateCcw, Smartphone, Tablet, Terminal, X, ZoomIn, ZoomOut } from 'lucide-react';

const LivePreview: FC = () => {
	const dispatch = useAppDispatch();
	const iframeRef = useRef<HTMLIFrameElement>(null)
	const [showDeviceMenu, setShowDeviceMenu] = useState(false)

	const {
		viewportSize,
		selectedDevice,
		zoom,
		autoRefresh,
		refreshKey,
		consoleMessages,
		showConsole,
		isLoading
	} = useAppSelector((state) => state.preview)

	const { openFiles, activeFileId } = useAppSelector((state) => state.editor)

	// Get the active file content
	const activeFile = openFiles.find(f => f.id === activeFileId);

	// Build the preview HTML
	const previewContent = useMemo(() => {
		if (!activeFile) {
			return `
			<!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              background: #1e1e1e;
              color: #888;
            }
          </style>
        </head>
        <body>
          <div>Open a file to preview</div>
        </body>
        </html>
			`;
		}

		const { content, language, filename } = activeFile;

		// If it's HTML file, render it directly
		if (language === 'html') {
			const consoleScript = `
				<script>
					(function() {
						const originalConsole = {
							log: console.log,
							warn: console.warn,
							error: console.error,
							info: console.info,
						};

						function sendToParent(type, args) {
							try {
								window.parent.postMessage({
									type: 'console',
									payload: {
										type: type,
										message: Array.from(args).map(arg => typeof arg === 'object' ? JSON.stringify(arg) : string(arg)).join(' ')
									}
								}, '*)
							} catch(e) {}
						} 
							console.log = function() { sendToParent('log', arguments); originalConsole.log.apply(console, arguments); };
							console.warn = function() { sendToParent('warn', arguments); originalConsole.warn.apply(console, arguments); };
							console.error = function() { sendToParent('error', arguments); originalConsole.error.apply(console, arguments); };
							console.info = function() { sendToParent('info', arguments); originalConsole.info.apply(console, arguments); };

							window.onerror = function(msg, url, line, col, error) {
								sentToParent('error', [msg + ' at line ' + line]);
								return false;
							}
					})();
				</script>
			`;

			// Insert the console script after <head> or at the start
			if (content.includes('<head>')) {
				return content.replace('<head>', '<head>' + consoleScript);
			} else if (content.includes('<html>')) {
				return content.replace('<html>', '<html><head>' + consoleScript + '</head>')
			}

			return consoleScript + content;
		}

		// For CSS files, show a styled preview
		if (language === 'css' || language === 'scss') {
			return `
				<!DOCTYPE html>
        <html>
        <head>
          <style>${content}</style>
          <style>
            body {
              padding: 20px;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              background: white;
            }
            .preview-section { margin-bottom: 30px; }
            .preview-section h3 { margin-bottom: 10px; color: #333; }
            .demo-box { padding: 20px; border: 1px solid #ddd; border-radius: 4px; }
          </style>
        </head>
        <body>
          <h1>CSS Preview: ${filename}</h1>
          <div class="preview-section">
            <h3>Typography</h3>
            <div class="demo-box">
              <h1>Heading 1</h1>
              <h2>Heading 2</h2>
              <h3>Heading 3</h3>
              <p>This is a paragraph with some <strong>bold</strong> and <em>italic</em> text.</p>
              <a href="#">This is a link</a>
            </div>
          </div>
          <div class="preview-section">
            <h3>Buttons</h3>
            <div class="demo-box">
              <button class="btn">Default Button</button>
              <button class="btn btn-primary">Primary Button</button>
              <button class="btn btn-secondary">Secondary Button</button>
            </div>
          </div>
          <div class="preview-section">
            <h3>Form Elements</h3>
            <div class="demo-box">
              <input type="text" placeholder="Text input" style="margin-right: 10px;">
              <select><option>Select option</option></select>
            </div>
          </div>
        </body>
        </html>
			`;
		}

		if (['javascript', 'typescript'].includes(language)) {
			return (
				`
					  <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              padding: 20px;
              font-family: 'JetBrains Mono', monospace;
              background: #1e1e1e;
              color: #d4d4d4;
              white-space: pre-wrap;
              font-size: 13px;
              line-height: 1.5;
            }
            .note {
              color: #6a9955;
              margin-bottom: 20px;
              font-style: italic;
            }
          </style>
        </head>
        <body>
          <div class="note">// JavaScript Preview - Console output will appear below</div>
          <script>
            try {
              ${content}
            } catch(e) {
              console.error(e.message);
            }
          </script>
        </body>
        </html>
				`
			);
		}

		if (language === 'markdown') {
			// Simple markdown to HTML conversion
			let html = content
				.replace(/^### (.*$)/gim, '<h3>$1</h3>')
				.replace(/^## (.*$)/gim, '<h2>$1</h2>')
				.replace(/^# (.*$)/gim, '<h1>$1</h1>')
				.replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
				.replace(/\*(.*)\*/gim, '<em>$1</em>')
				.replace(/\n/gim, '<br>');

			return `
				<!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              padding: 40px;
              max-width: 800px;
              margin: 0 auto;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              line-height: 1.6;
              color: #333;
            }
            h1, h2, h3 { margin-top: 24px; }
            code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; }
            pre { background: #f4f4f4; padding: 16px; border-radius: 6px; overflow-x: auto; }
          </style>
        </head>
        <body>${html}</body>
        </html>
			`;
		}

		// Default preview for other file types
		return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #1e1e1e;
            color: #888;
            text-align: center;
          }
          .filename { color: #0078d4; margin-bottom: 10px; }
          .type { font-size: 14px; color: #666; }
        </style>
      </head>
      <body>
        <div class="filename">${filename}</div>
        <div class="type">Preview not available for ${language} files</div>
      </body>
      </html>
		`;
	}, [activeFile, refreshKey])

	// Listen for console messages from iframe
	useEffect(() => {
		const handleMessage = (event: MessageEvent) => {
			if (event.data.type === 'console') {
				// dispatch(addConsoleMessage(event.data.payload))
			}
		}

		window.addEventListener('message', handleMessage);
		return () => window.removeEventListener('message', handleMessage);
	}, [dispatch])

	// Handle iframe load
	const handleIframeLoad = () => {
		dispatch(setLoading(false))
	}

	const handleRefresh = () => {
		dispatch(setLoading(true))
		dispatch(refresh())
	}

	const handleOpenExternal = () => {
		const blob = new Blob([previewContent], { type: 'text/html' });
		const url = URL.createObjectURL(blob);
		window.open(url, '_blank');
	}

	// Calculate scaled dimensions
	const scale = zoom / 100;
	const scaledWidth = viewportSize.width * scale;
	const scaledHeight = viewportSize.height * scale;

	// Group devices by type
	const mobileDevices = devicePresets.filter(d => d.type === 'mobile');
	const tabletDevices = devicePresets.filter(d => d.type === 'tablet');
	const desktopDevices = devicePresets.filter(d => d.type === 'desktop');

	return (
		<div className='flex flex-col h-full bg-editor-fg'>
			{/* Preview Toolbar */}
			<div className="flex items-center justify-between h-8.75 px-2 bg-titlebar-bg border-b border-panel-border">
				{/* Left: Device Selection */}
				<div className="flex items-center gap-2">
					{/* Device dropdown */}
					<div className="relative">
						<button className="flex items-center gap-2 px-2 py-1 text-xs rounded text-sidebar-fg hover:bg-hover">
							{selectedDevice ? (
								<>
									{selectedDevice.type === 'mobile' && <Smartphone size={14} />}
									{selectedDevice.type === 'tablet' && <Tablet size={14} />}
									{selectedDevice.type === 'desktop' && <Monitor size={14} />}
								</>
							) : (
								<>
									<Monitor size={14} />
									<span>Responsive</span>
								</>
							)}
							<ChevronDown />
						</button>

						{showDeviceMenu && (
							<div className="absolute top-full left-0 mt-1 w-56 py-1 bg-[#3c3c3c] border border-[#454545] rounded shadow-lg z-50">
								<button className="flex items-center w-full gap-2 px-3 py-1 text-xs 5 text-editor-fg hover:bg-accent">
									<Maximize2 size={14} />
									<span>Responsive</span>
								</button>
								<div className="my-1 border-t border-[#454545]" />
								<div className="px-3 py-1 uppercase text-xxs text-sidebar-fg/50">Mobile</div>
								{mobileDevices.map((device) => (
									<button
										key={device.id}
										onClick={() => {
											dispatch(selectDevice(device))
											setShowDeviceMenu(false);
										}}
										className='w-full flex items-center justify-between px-3 py-1.5 text-xs text-editor-fg hover:bg-accent'
									>
										<span className="flex items-center gap-2">
											<Smartphone size={14} />
											{device.name}
										</span>
										<span className='text-sidebar-fg/50'>{device.width}*{device.height}</span>
									</button>
								))}
								<div className="my-1 border-t border-[#454545]" />
								<div className="px-3 py-1 uppercase text-xxs text-sidebar-fg/50">Tablet</div>
								{tabletDevices.map((device) => (
									<button
										key={device.id}
										onClick={() => {
											dispatch(selectDevice(device));
											setShowDeviceMenu(false);
										}}
										className='w-full flex items-center justify-between px-3 py-1.5 text-xs text-editor-fg hover:bg-accent'
									>
										<span className="flex items-center gap-2">
											<Tablet size={14} />
											{device.name}
										</span>
										<span className="text-sidebar-fg/50">{device.width}×{device.height}</span>
									</button>
								))}
								<div className="my-1 border-t border-[#454545]" />
								<div className="px-3 py-1 uppercase text-xxs text-sidebar-fg/50">Desktop</div>
								{desktopDevices.map((device) => (
									<button
										key={device.id}
										onClick={() => {
											dispatch(selectDevice(device));
											setShowDeviceMenu(false);
										}}
										className='w-full flex items-center justify-between px-3 py-1.5 text-xs text-editor-fg hover:bg-accent'
									>
										<span className="flex items-center gap-2">
											<Monitor size={14} />
											{device.name}
										</span>
										<span className="text-sidebar-fg/50">{device.width}×{device.height}</span>
									</button>
								))}
							</div>
						)}
					</div>

					{/* Viewport Size Display */}
					<span className="text-xxs text-sidebar-fg/50">
						{viewportSize.width} × {viewportSize.height}
					</span>

					{/* Rotate */}
					<button
						onClick={() => dispatch(rotateDevice())}
						className='p-1.5 hover:bg-hover rounded'
						title="Rotate"
					>
						<RotateCcw size={14} className='text-sidebar-fg/70' />
					</button>
				</div>

				{/* Center: Zoom Controls */}
				<div className="flex items-center gap-1">
					<button
						onClick={() => dispatch(zoomOut())}
						className="p-1.5 hover:bg-hover rounded"
						title='Zoom out'
					>
						<ZoomOut size={14} className='text-sidebar-fg/70' />
					</button>
					<button
						onClick={() => dispatch(resetZoom())}
						className="px-2 py-1 text-xs text-sidebar-fg min-w-12.5 hover:bg-hover rounded"
						title='Reset Zoom'
					>
						{zoom}%
					</button>
					<button
						onClick={() => dispatch(zoomIn())}
						className="p-1.5 hover:bg-hover rounded"
						title='Zoom In'
					>
						<ZoomIn size={14} className='text-sidebar-fg/70' />
					</button>
				</div>

				{/* Right: Actions */}
				<div className="flex items-center gap-1">
					<button>
						{autoRefresh ? (
							<Play size={14} className='text-white' />
						)
							: (
								<Pause size={14} className='text-sidebar-fg/70' />
							)}
					</button>
					<button
						onClick={handleRefresh}
						className="p-1.5 hover:bg-hover rounded"
						title='Refresh'
					>
						<RefreshCcw size={14} className={`text-sidebar-fg/70 ${isLoading ? 'animate-spin' : ''}`} />
					</button>
					<button
						onClick={() => dispatch(toggleConsole())}
						className={`p-1.5 rounded ${showConsole ? 'bg-accent' : 'hover:bg-hover'}`}
						title='Toggle Console'
					>
						<Terminal size={14} className={showConsole ? 'text-white' : 'text-sidebar-fg/70'} />
					</button>

					<button
						onClick={handleOpenExternal}
						className={`p-1.5 rounded hover:bg-hover`}
						title='Open in New Tab'
					>
						<ExternalLink size={14} className={'text-sidebar-fg/70'} />
					</button>
				</div>
			</div>

			{/* Preview Content */}
			<div className="flex-1 overflow-auto bg-[#2d2d2d] flex items-center justify-center p-4">
				<div
					className="relative transition-all duration-200 bg-white shadow-2xl"
					style={{
						width: scaledWidth,
						height: scaledHeight,
						minWidth: scaledWidth,
						minHeight: scaledHeight,
					}}
				>
					{/* Device Frame */}
					{selectedDevice && selectedDevice.type === 'mobile' && (
						<div className="absolute -inset-3 rounded-4xl border-12 border-[#1a1a1a] pointer-events-none"
							style={{ borderRadius: '2rem' }}
						>
							{/* Notch */}
							<div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#1a1a1a] rounded-b-xl" />
						</div>
					)}

					{/* Loading Overlay */}
					{isLoading && (
						<div className='absolute inset-0 z-10 flex items-center justify-center bg-editor-bg/80'>
							<RefreshCw size={24} className='text-accent animate-spin' />
						</div>
					)}

					{/* Iframe */}
					<iframe
						ref={iframeRef}
						key={refreshKey}
						srcDoc={previewContent}
						title="Preview"
						className='w-full h-full border-0'
						style={{
							width: viewportSize.width,
							height: viewportSize.height,
							transform: `scale(${scale})`,
							transformOrigin: 'top left'
						}}
						onLoad={handleIframeLoad}
						sandbox='allow-scripts allow-same-origin allow-forms allow-modals'
					/>
				</div>
			</div>

			{/* Console Panel */}
			{showConsole && (
				<div className='h-37.5 border-t border-panel-border bg-panel-bg flex flex-col'>
					<div className="flex items-center justify-between px-2 border-b h-7 border-panel-border">
						<span className="text-xs text-sidebar-fg/70">Console</span>
						<div className="flex items-center gap-1">
							<button
								onClick={() => dispatch(clearConsole())}
								className='px-2 py-0.5 text-xss text-sidebar-fg/50 hover:text-sidebar-fg'>
								Clear
							</button>
							<button
								onClick={() => dispatch(toggleConsole())}
								className='p-1 rounded hover:bg-hover'>
								<X size={12} className='text-sidebar-fg/50' />
							</button>
						</div>
					</div>
					<div className="flex-1 p-2 overflow-auto font-mono text-xs">
						{consoleMessages.length === 0 ? (
							<div className='italic text-sidebar-fg/30'>No console output</div>
						) : (
							consoleMessages.map((msg) => (
								<div key={msg.id} className={`py-0.5 ${msg.type === 'error'
									? 'text-error'
									: msg.type === 'warn'
										? 'text-warning'
										: msg.type === 'info'
											? 'text-info'
											: 'text-editor-fg'
									}`}>
									<span className="mr-2 text-sidebar-fg/30">
										{new Date(msg.timestamp).toLocaleDateString()}
									</span>
									{msg.message}
								</div>
							))
						)}
					</div>
				</div>
			)}
		</div>
	)
}

export default LivePreview