import { Braces, Code, Database, File, FileAudio, FileCode, FileImage, FileText, FileType, FileVideo, Folder, FolderOpen, GitBranch, Hash, Package, Settings } from 'lucide-react';
import type React from 'react';

interface FileIconProps {
	filename: string;
	isFolder?: boolean;
	isExpanded?: boolean;
	size?: number;
	className?: string;
}

const FileIcon: React.FC<FileIconProps> = ({
	filename,
	isFolder = false,
	isExpanded = false,
	size = 16,
	className = ''
}) => {
	const iconProps = {
		size,
		className: `flex-shrink-0 ${className}`
	}

	// Folder icons
	if (isFolder) {
		// Special folder colors
		const folderName = filename.toLowerCase()
		let folderColor = 'text-yellow-500'

		if (folderName === 'src' || folderName === 'source') {
			folderColor = 'text-blue-400';
		} else if (folderName === 'component') {
			folderColor = 'text-green-400';
		} else if (folderName === 'styles' || folderName === 'css') {
			folderColor = 'text-pink-400';
		} else if (folderName === 'node_modules') {
			folderColor = 'text-gray-400';
		} else if (folderName === 'images' || folderName === 'img') {
			folderColor = 'text-orange-400';
		}

		return isExpanded ? (
			<FolderOpen {...iconProps} className={`${iconProps.className} ${folderColor}`} />
		) : (
			<Folder {...iconProps} className={`${iconProps.className} ${folderColor}`} />
		)
	}

	// Get file extension
	const extension = filename.split('.').pop()?.toLowerCase() || '';

	// Map extensions to icons and colors
	const iconMap: Record<string, { icon: React.ReactNode; color: string }> = {
		// HTML
		html: { icon: <Code {...iconProps} />, color: 'text-orange-500' },
		htm: { icon: <Code {...iconProps} />, color: 'text-orange-500' },

		// CSS
		css: { icon: <Hash {...iconProps} />, color: 'text-blue-500' },
		scss: { icon: <Hash {...iconProps} />, color: 'text-pink-500' },
		sass: { icon: <Hash {...iconProps} />, color: 'text-pink-500' },
		less: { icon: <Hash {...iconProps} />, color: 'text-purple-500' },

		// JavaScript
		js: { icon: <FileCode {...iconProps} />, color: 'text-yellow-400' },
		jsx: { icon: <FileCode {...iconProps} />, color: 'text-cyan-400' },
		mjs: { icon: <FileCode {...iconProps} />, color: 'text-yellow-400' },

		// TypeScript
		ts: { icon: <FileCode {...iconProps} />, color: 'text-blue-500' },
		tsx: { icon: <FileCode {...iconProps} />, color: 'text-blue-400' },

		// JSON
		json: { icon: <Braces {...iconProps} />, color: 'text-yellow-500' },

		// Markdown
		md: { icon: <FileText {...iconProps} />, color: 'text-blue-300' },
		mdx: { icon: <FileText {...iconProps} />, color: 'text-yellow-300' },

		// Images
		png: { icon: <FileImage {...iconProps} />, color: 'text-purple-400' },
		jpg: { icon: <FileImage {...iconProps} />, color: 'text-purple-400' },
		jpeg: { icon: <FileImage {...iconProps} />, color: 'text-purple-400' },
		gif: { icon: <FileImage {...iconProps} />, color: 'text-purple-400' },
		svg: { icon: <FileImage {...iconProps} />, color: 'text-orange-400' },
		webp: { icon: <FileImage {...iconProps} />, color: 'text-purple-400' },
		ico: { icon: <FileImage {...iconProps} />, color: 'text-purple-400' },

		// Video
		mp4: { icon: <FileVideo {...iconProps} />, color: 'text-red-400' },
		webm: { icon: <FileVideo {...iconProps} />, color: 'text-red-400' },
		mov: { icon: <FileVideo {...iconProps} />, color: 'text-red-400' },

		// Audio
		mp3: { icon: <FileAudio {...iconProps} />, color: 'text-pink-400' },
		wav: { icon: <FileAudio {...iconProps} />, color: 'text-pink-400' },

		// Config
		yaml: { icon: <Settings {...iconProps} />, color: 'text-red-400' },
		yml: { icon: <Settings {...iconProps} />, color: 'text-red-400' },
		toml: { icon: <Settings {...iconProps} />, color: 'text-gray-400' },
		ini: { icon: <Settings {...iconProps} />, color: 'text-gray-400' },
		env: { icon: <Settings {...iconProps} />, color: 'text-yellow-600' },

		// Database
		sql: { icon: <Database {...iconProps} />, color: 'text-blue-400' },

		// Git
		gitignore: { icon: <GitBranch {...iconProps} />, color: 'text-orange-500' },

		// Package
		lock: { icon: <Package {...iconProps} />, color: 'text-red-400' },

		// PHP
		php: { icon: <FileCode {...iconProps} />, color: 'text-purple-500' },

		// Python
		py: { icon: <FileCode {...iconProps} />, color: 'text-yellow-500' },

		// Fonts
		ttf: { icon: <FileType {...iconProps} />, color: 'text-red-300' },
		otf: { icon: <FileType {...iconProps} />, color: 'text-red-300' },
		woff: { icon: <FileType {...iconProps} />, color: 'text-red-300' },
		woff2: { icon: <FileType {...iconProps} />, color: 'text-red-300' },

		// Default
		txt: { icon: <FileText {...iconProps} />, color: 'text-gray-400' },
	}

	// Special filenames
	const specialFiles: Record<string, { icon: React.ReactNode; color: string }> = {
		'package.json': { icon: <Package {...iconProps} />, color: 'text-green-500' },
		'package-lock.json': { icon: <Package {...iconProps} />, color: 'text-red-400' },
		'tsconfig.json': { icon: <Braces {...iconProps} />, color: 'text-blue-500' },
		'vite.config.ts': { icon: <Settings {...iconProps} />, color: 'text-purple-500' },
		'vite.config.js': { icon: <Settings {...iconProps} />, color: 'text-purple-500' },
		'.gitignore': { icon: <GitBranch {...iconProps} />, color: 'text-orange-500' },
		'.env': { icon: <Settings {...iconProps} />, color: 'text-yellow-600' },
		'.env.local': { icon: <Settings {...iconProps} />, color: 'text-yellow-600' },
		'readme.md': { icon: <FileText {...iconProps} />, color: 'text-blue-400' },
		'license': { icon: <FileText {...iconProps} />, color: 'text-yellow-500' },
	};

	// Check for special filename first
	const lowerFilename = filename.toLowerCase()
	if (specialFiles[lowerFilename]) {
		const { color, icon } = specialFiles[lowerFilename]
		return <span className={color}>{icon}</span>
	}

	// Then check extension
	if (iconMap[extension]) {
		const { icon, color } = iconMap[extension]
		return <span className={color}>{icon}</span>
	}

	// Default file icon
	return <File {...iconProps} className={`${iconProps.className} text-gray-400`} />
}

export default FileIcon;