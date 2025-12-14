/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			colors: {
				// VS Code inspired dark theme
				'editor-bg': '#1e1e1e',
				'editor-fg': '#d4d4d4',
				'sidebar-bg': '#252526',
				'sidebar-fg': '#cccccc',
				'titlebar-bg': '#323233',
				'activitybar-bg': '#333333',
				'panel-bg': '#1e1e1e',
				'panel-border': '#3c3c3c',
				'tab-active': '#1e1e1e',
				'tab-inactive': '#2d2d2d',
				'tab-border': '#252526',
				'accent': '#0078d4',
				'accent-hover': '#1c8ae6',
				'selection': '#264f78',
				'hover': '#2a2d2e',
				'focus-border': '#007acc',
				'success': '#4ec9b0',
				'warning': '#dcdcaa',
				'error': '#f14c4c',
				'info': '#75beff',
			},
			fontFamily: {
				'mono': ['JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'monospace'],
				'sans': ['Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif'],
			},
			fontSize: {
				'xxs': '10px',
				'xs': '11px',
				'sm': '12px',
				'base': '13px',
				'lg': '14px',
			},
			animation: {
				'fade-in': 'fadeIn 0.15s ease-out',
				'slide-in': 'slideIn 0.2s ease-out',
				'pulse-slow': 'pulse 2s ease-in-out infinite',
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
				slideIn: {
					'0%': { opacity: '0', transform: 'translateY(-4px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
			},
		},
	},
	plugins: [],
}
