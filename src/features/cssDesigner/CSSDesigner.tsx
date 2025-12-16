import { AlignCenter, AlignJustify, AlignLeft, AlignRight, ChevronDown, ChevronRight, Copy, Divide, Layout, Move, Palette, Sparkles, Square, Type, Underline } from 'lucide-react';
import React from 'react';
import { useAppDispatch, useAppSelector } from '../../hook/useRedux';
import { alignItemsOptions, borderStyleOptions, displayOptions, flexDirectionOptions, fontFamilyOptions, fontWeightOptions, justifyContentOptions, positionOptions, toggleShowComputed, updateCSSProperty } from './cssDesignerSlice';

// Color picker component
const ColorPicker: React.FC<{
	value: string;
	onChange: (value: string) => void;
	label: string;
}> = ({ value, onChange, label }) => {
	return (
		<div className='flex items-center gap-2'>
			<label className="w-24 text-xs text-sidebar-fg/70">{label}</label>
			<div className="flex items-center flex-1 gap-2">
				<input
					type='color'
					value={value || '#000000'}
					onChange={e => onChange(e.target.value)}
					className='w-8 h-6 border rounded cursor-pointer border-panel-border'
				/>
				<input
					type='text'
					value={value || ''}
					onChange={e => onChange(e.target.value)}
					className='flex-1 h-6 px-2 text-xs border bg-editor-bg border-panel-border text-editor-fg focus:border-focus-border focus:outline-none'
				/>
			</div>
		</div>
	)
}

// Number input with unit
const NumberInput: React.FC<{
	value: string;
	onChange: (value: string) => void
	label: string
	units?: string[]
	min?: number
	max?: number
}> = ({ value, onChange, label, units = ['px', '%', 'em', 'rem', 'vw', 'vh'], min, max }) => {
	const parseValue = (val: string) => {
		const match = val.match(/^(-?\d*\.?\d+)(.*)$/);
		return match ? { num: match[1], unit: match[2] || 'px' } : { num: '', unit: 'px' }
	}

	const { num, unit } = parseValue(value || '')

	return (
		<div className='flex items-center gap-2'>
			<label className="w-24 text-xs text-sidebar-fg/70">{label}</label>
			<div className="flex items-center flex-1">
				<input
					type="number"
					value={num}
					onChange={e => onChange(`${e.target.value}${unit}`)}
					min={min}
					max={max}
					className='flex-1 h-6 px-2 text-xs border border-r-0 rounded-l bg-editor-bg border-panel-border text-editor-fg focus:border-focus-border focus:outline-none'
				/>
				<select
					value={unit}
					onChange={e => onChange(`${num}${e.target.value}`)}
					className='h-6 px-1 text-xs border rounded-r bg-editor-bg border-panel-border text-editor-fg focus:border-focus-border focus:outline-none'
				>
					{units.map((u) => (
						<option key={u} value={u}>{u}</option>
					))}
				</select>
			</div>
		</div>
	)
}

// Select input
const SelectInput: React.FC<{
	value: string;
	onChange: (value: string) => void;
	label: string;
	options: Array<{ label: string; value: string } | string>;
}> = ({ value, onChange, label, options }) => (
	<div className='flex items-center gap-2'>
		<label className="w-24 text-xs text-sidebar-fg/70">{label}</label>
		<select
			value={value || ''}
			onChange={e => onChange(e.target.value)}
			className="flex-1 h-6 px-2 text-xs border bg-editor-bg border-panel-border text-editor-fg focus:border-focus-border focus:outline-none"
		>
			<option value="">--</option>
			{options.map((opt) => {
				const optValue = typeof opt === 'string' ? opt : opt.value;
				const optLabel = typeof opt === 'string' ? opt : opt.label;
				return (
					<option key={optValue} value={optValue}>{optLabel}</option>
				)
			})}
		</select>
	</div>
);

const BoxInput: React.FC<{
	prop: string;
	value: string;
	position: string,
	onChange: (property: string, value: string) => void;
}> = ({ prop, value, position, onChange }) => (
	<input
		type='text'
		value={value || '-'}
		onChange={e => onChange(prop, e.target.value)}
		className={`
        w-10 h-5 text-center text-xxs bg-transparent border-none
        text-editor-fg focus:bg-editor-bg focus:outline-none
        ${position}
      `}
		placeholder="-"
	/>
)

// Box model visual editor
const BoxModelEditor: React.FC<{
	boxModel: {
		marginTop: string;
		marginRight: string;
		marginBottom: string;
		marginLeft: string;
		paddingTop: string;
		paddingRight: string;
		paddingBottom: string;
		paddingLeft: string;
		width: string;
		height: string;
	};
	onChange: (property: string, value: string) => void;
}> = ({ onChange, boxModel }) => (
	<div className='p-4 bg-[#2a2a2a] rounded'>
		<div className="mb-1 text-center text-xxs text-sidebar-fg">margin</div>
		<div className="relative bg-[#f9cc9d33] p-4 rounded">
			{/* Margin input */}
			<div className="absolute top-0 translate-x-1/2 left-1/2">
				<BoxInput prop='margin-top' value={boxModel.marginTop} position='' onChange={onChange} />
			</div>
			<div className="absolute right-0 translate-y-1/2 top-1/2">
				<BoxInput prop='margin-right' value={boxModel.marginRight} position='' onChange={onChange} />
			</div>
			<div className="absolute bottom-0 translate-x-1/2 left-1/2">
				<BoxInput prop='margin-bottom' value={boxModel.marginBottom} position='' onChange={onChange} />
			</div>
			<div className="absolute left-0 translate-y-1/2 top-1/2">
				<BoxInput prop='margin-left' value={boxModel.marginLeft} position='' onChange={onChange} />
			</div>

			<div className="mb-1 text-center text-xxs text-sidebar-fg/50">padding</div>
			<div className="relative bg-[#c3d08b33] p-4 rounded">
				{/* Padding inputs */}
				<div className="absolute top-0 translate-x-1/2 left-1/2">
					<BoxInput prop='padding-top' value={boxModel.paddingTop} position='' onChange={onChange} />
				</div>
				<div className="absolute right-0 translate-y-1/2 top-1/2">
					<BoxInput prop='padding-right' value={boxModel.paddingRight} position='' onChange={onChange} />
				</div>
				<div className="absolute bottom-0 translate-x-1/2 left-1/2">
					<BoxInput prop='padding-bottom' value={boxModel.paddingBottom} position='' onChange={onChange} />
				</div>
				<div className="absolute left-0 translate-y-1/2 top-1/2">
					<BoxInput prop='padding-left' value={boxModel.paddingLeft} position='' onChange={onChange} />
				</div>

				{/* Content */}
				<div className="p-4 rounded text-center bg-[#8cb4d933]">
					<div className="mb-1 text-xxs text-sidebar-fg/50">content</div>
					<div className="flex items-center justify-center gap-2">
						<input
							type='text'
							value={boxModel.width || 'auto'}
							onChange={e => onChange('width', e.target.value)}
							className="h-5 text-center border w-14 text-xxs bg-editor-bg border-panel-border text-editor-fg focus:outline-none"
							placeholder='auto'
						/>
						<span className="text-xxs text-sidebar-fg/50">×</span>
						<input
							type="text"
							value={boxModel.height || 'auto'}
							onChange={e => onChange('height', e.target.value)}
							className="h-5 text-center border w-14 text-xxs bg-editor-bg border-panel-border text-editor-fg focus:outline-none"
							placeholder='auto'
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
)

// Section component
const Section: React.FC<{
	title: string;
	icon: React.ReactNode;
	isOpen: boolean;
	onToggle: () => void;
	children: React.ReactNode;
}> = ({ title, icon, isOpen, onToggle, children }) => (
	<div className="border-b border-panel-border">
		<button
			onClick={onToggle}
			className='flex items-center w-full gap-2 px-3 py-2 text-xs hover:bg-hover text-sidebar-fg'
		>
			{isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
			{icon}
			<span>{title}</span>
		</button>
		{isOpen && <div className='px-3 py-2 space-y-3'>{children}</div>}
	</div>
)

const CSSDesigner: React.FC = () => {
	const dispatch = useAppDispatch();
	const {
		selectedElement,
		inlineStyles,
		boxModel,
		showComputed,
		computedStyles
	} = useAppSelector(state => state.cssDesigner)

	// Track which sections are expanded
	const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>({
		layout: true,
		typography: true,
		background: true,
		border: true,
		effects: true,
		position: true,
	});

	const toggleSection = (section: string) => {
		setExpandedSections(prev => ({
			...prev,
			[section]: !prev[section]
		}))
	}

	const handlePropertyChange = React.useCallback((property: string, value: string) => {
		dispatch(updateCSSProperty({ property, value }))
	}, [dispatch])

	const getStyleValue = (property: string) => {
		return inlineStyles[property] || computedStyles[property] || '';
	}

	return (
		<div className="flex flex-col h-full overflow-hidden bg-sidebar-bg text-sidebar-fg">
			{/* Header */}
			<div className="flex items-center justify-between px-3 border-b border-panel-border h-8.75">
				<span className="text-xs font-medium">CSS Designer</span>
				<div className="flex items-center gap-1">
					<button
						onClick={() => dispatch(toggleShowComputed())}
						className={`px-2 py-0.5 text-xxs rounded ${showComputed ? 'bg-accent text-white' : 'text-sidebar-fg/50 hover:bg-hover'
							}`}
					>
						Computed
					</button>
				</div>
			</div>

			{/* Element info */}
			{selectedElement ? (
				<div className="px-3 py-2 bg-[#2a2a2a] border-b border-panel-border">
					<div className="flex items-center gap-2">
						<span className="font-mono text-xs text-accent">&lt;{selectedElement.tagName}&gt;</span>
						{selectedElement.id && (
							<span className='text-yellow-400 text-xxs'>#{selectedElement.id}</span>
						)}
					</div>
					{selectedElement.classes.length > 0 && (
						<div className='flex flex-wrap gap-1 mt-1'>
							{selectedElement.classes.map(cls => (
								<span key={cls} className='px-1 py-0.5 text-xxs bg-panel-border rounded'>
									.{cls}
								</span>
							))}
						</div>
					)}
				</div>
			) : (
				<div className="px-3 py-4 text-xs text-center text-sidebar-fg/50">
					Select an element to edit its styles
				</div>
			)}

			{/* CSS Sections */}
			<div className="flex-1 overflow-y-auto">
				{/* Layout Section */}
				<Section
					title='layout'
					icon={<Layout size={14} />}
					isOpen={expandedSections.layout}
					onToggle={() => toggleSection('layout')}
				>
					<SelectInput
						label='Display'
						value={getStyleValue('display')}
						onChange={v => handlePropertyChange('display', v)}
						options={displayOptions}
					/>
					<SelectInput
						label='Position'
						value={getStyleValue('position')}
						onChange={v => handlePropertyChange('position', v)}
						options={positionOptions}
					/>

					{/* Flexbox controls */}
					{getStyleValue('display')?.includes('flex') && (
						<>
							<SelectInput
								label='Direction'
								value={getStyleValue('flex-direction')}
								onChange={v => handlePropertyChange('flex-direction', v)}
								options={flexDirectionOptions}
							/>
							<SelectInput
								label='Justify'
								value={getStyleValue('justify-content')}
								onChange={v => handlePropertyChange('justify-content', v)}
								options={justifyContentOptions}
							/>
							<SelectInput
								label='Align'
								value={getStyleValue('align-items')}
								onChange={v => handlePropertyChange('align-items', v)}
								options={alignItemsOptions}
							/>
							<SelectInput
								label='Gap'
								value={getStyleValue('gap')}
								onChange={v => handlePropertyChange('gap', v)}
								options={alignItemsOptions}
							/>
						</>
					)}
					<SelectInput
						label='Overflow'
						value={getStyleValue('overflow')}
						onChange={v => handlePropertyChange('overflow', v)}
						options={['visible', 'hidden', 'scroll', 'auto']}
					/>
					<NumberInput
						label='Z-Index'
						value={getStyleValue('z-index')}
						onChange={v => handlePropertyChange('z-index', v)}
						units={['']}
					/>
				</Section>

				{/* Box Model / Position Section */}
				<Section
					title='Box Model'
					icon={<Move size={14} />}
					isOpen={expandedSections.position}
					onToggle={() => toggleSection('position')}
				>
					<BoxModelEditor boxModel={boxModel} onChange={handlePropertyChange} />
				</Section>

				{/* Typography section */}
				<Section
					title='Typography'
					icon={<Type size={14} />}
					isOpen={expandedSections.typography}
					onToggle={() => toggleSection('typography')}>
					<SelectInput
						label='Font Family'
						value={getStyleValue('font-family')}
						onChange={v => handlePropertyChange('font-family', v)}
						options={fontFamilyOptions}
					/>
					<NumberInput
						label='Font Size'
						value={getStyleValue('font-size')}
						onChange={v => handlePropertyChange('font-size', v)}
					/>
					<SelectInput
						label='Font Weight'
						value={getStyleValue('font-weight')}
						onChange={v => handlePropertyChange('font-weight', v)}
						options={fontWeightOptions}
					/>
					<NumberInput
						label='Line Height'
						value={getStyleValue('line-height')}
						onChange={v => handlePropertyChange('line-height', v)}
						units={['', 'px', 'em', '%']}
					/>
					<NumberInput
						label='Letter Spacing'
						value={getStyleValue('letter-spacing')}
						onChange={v => handlePropertyChange('letter-spacing', v)}
					/>

					{/* Text Align Buttons */}
					<div className="flex items-center gap-2">
						<label className="w-24 text-xs text-sidebar-fg/70">Text Align</label>
						<div className="flex items-center gap-1">
							{[
								{ value: 'left', icon: <AlignLeft size={14} /> },
								{ value: 'center', icon: <AlignCenter size={14} /> },
								{ value: 'right', icon: <AlignRight size={14} /> },
								{ value: 'justify', icon: <AlignJustify size={14} /> },
							].map(({ value, icon }) => (
								<button
									key={value}
									onClick={() => handlePropertyChange('text-align', value)}
									className={`p-1.5 rounded ${getStyleValue('text-align') === value ? 'bg-accent text-white' : 'hover:bg-hover'
										}`}
								>
									{icon}
								</button>
							))}
						</div>
					</div>

					{/* Text Decoration Buttons */}
					<div className="flex items-center gap-2">
						<label className="w-24 text-xs text-sidebar-fg/70">Decoration</label>
						<div className="flex items-center gap-1">
							{[
								{ value: 'none', label: 'None' },
								{ value: 'underline', icon: <Underline size={14} /> },
								{ value: 'line-through', label: 'S' },
								{ value: 'overline', label: 'O' },
							].map((item) => (
								<button
									key={item.value}
									onClick={() => handlePropertyChange('text-decoration', item.value)}
									className={`p-1.5 rounded ${getStyleValue('text-decoration') === item.value ? 'bg-accent text-white' : 'hover:bg-hover'
										}`}
								>
									{item.icon || item.label}
								</button>
							))}
						</div>
					</div>

					<SelectInput
						label='Transform'
						value={getStyleValue('text-transform')}
						onChange={v => handlePropertyChange('text-transform', v)}
						options={['none', 'uppercase', 'lowercase', 'capitalize']}
					/>
					<ColorPicker
						label="Color"
						value={getStyleValue('color')}
						onChange={v => handlePropertyChange('color', v)}
					/>
				</Section>

				{/* Background Section */}
				<Section
					title="Background"
					icon={<Palette size={14} />}
					isOpen={expandedSections.background}
					onToggle={() => toggleSection('background')}
				>
					<ColorPicker
						label="Color"
						value={getStyleValue('background-color')}
						onChange={(v) => handlePropertyChange('background-color', v)}
					/>
					<div className="flex items-center gap-2">
						<label className="w-24 text-xs text-sidebar-fg/70">Image</label>
						<input
							type="text"
							value={getStyleValue('background-image') || ''}
							onChange={(e) => handlePropertyChange('background-image', e.target.value)}
							placeholder="url(...)"
							className="flex-1 h-6 px-2 text-xs border bg-editor-bg border-panel-border text-editor-fg focus:border-focus-border focus:outline-none"
						/>
					</div>
					<SelectInput
						label="Repeat"
						value={getStyleValue('background-repeat')}
						onChange={(v) => handlePropertyChange('background-repeat', v)}
						options={['repeat', 'repeat-x', 'repeat-y', 'no-repeat']}
					/>
					<SelectInput
						label="Size"
						value={getStyleValue('background-size')}
						onChange={(v) => handlePropertyChange('background-size', v)}
						options={['auto', 'cover', 'contain']}
					/>
					<SelectInput
						label="Position"
						value={getStyleValue('background-position')}
						onChange={(v) => handlePropertyChange('background-position', v)}
						options={['center', 'top', 'bottom', 'left', 'right', 'top left', 'top right', 'bottom left', 'bottom right']}
					/>
				</Section>
				{/* Border Section */}
				<Section
					title="Border"
					icon={<Square size={14} />}
					isOpen={expandedSections.border}
					onToggle={() => toggleSection('border')}
				>
					<NumberInput
						label="Width"
						value={getStyleValue('border-width')}
						onChange={(v) => handlePropertyChange('border-width', v)}
					/>

					<SelectInput
						label="Style"
						value={getStyleValue('border-style')}
						onChange={(v) => handlePropertyChange('border-style', v)}
						options={borderStyleOptions}
					/>

					<ColorPicker
						label="Color"
						value={getStyleValue('border-color')}
						onChange={(v) => handlePropertyChange('border-color', v)}
					/>

					<NumberInput
						label="Radius"
						value={getStyleValue('border-radius')}
						onChange={(v) => handlePropertyChange('border-radius', v)}
					/>

					{/* Individual corners */}
					<div className="pt-2 mt-2 border-t border-panel-border">
						<div className="mb-2 text-xxs text-sidebar-fg/50">Individual Corners</div>
						<div className="grid grid-cols-2 gap-2">
							<NumberInput
								label="TL"
								value={getStyleValue('border-top-left-radius')}
								onChange={(v) => handlePropertyChange('border-top-left-radius', v)}
							/>
							<NumberInput
								label="TR"
								value={getStyleValue('border-top-right-radius')}
								onChange={(v) => handlePropertyChange('border-top-right-radius', v)}
							/>
							<NumberInput
								label="BL"
								value={getStyleValue('border-bottom-left-radius')}
								onChange={(v) => handlePropertyChange('border-bottom-left-radius', v)}
							/>
							<NumberInput
								label="BR"
								value={getStyleValue('border-bottom-right-radius')}
								onChange={(v) => handlePropertyChange('border-bottom-right-radius', v)}
							/>
						</div>
					</div>
				</Section>

				{/* Effects Section */}

				<Section
					title="Effects"
					icon={<Sparkles size={14} />}
					isOpen={expandedSections.effects}
					onToggle={() => toggleSection('effects')}
				>
					<NumberInput
						label="Opacity"
						value={getStyleValue('opacity')}
						onChange={(v) => handlePropertyChange('opacity', v)}
						units={['']}
						min={0}
						max={1}
					/>

					<div className="flex items-center gap-2">
						<label className="w-24 text-xs text-sidebar-fg/70">Box Shadow</label>
						<input
							type="text"
							value={getStyleValue('box-shadow') || ''}
							onChange={(e) => handlePropertyChange('box-shadow', e.target.value)}
							placeholder="0 2px 4px rgba(0,0,0,0.1)"
							className="flex-1 h-6 px-2 text-xs border bg-editor-bg border-panel-border text-editor-fg focus:border-focus-border focus:outline-none"
						/>
					</div>

					<div className="flex items-center gap-2">
						<label className="w-24 text-xs text-sidebar-fg/70">Text Shadow</label>
						<input
							type="text"
							value={getStyleValue('text-shadow') || ''}
							onChange={(e) => handlePropertyChange('text-shadow', e.target.value)}
							placeholder="1px 1px 2px #000"
							className="flex-1 h-6 px-2 text-xs border bg-editor-bg border-panel-border text-editor-fg focus:border-focus-border focus:outline-none"
						/>
					</div>

					<div className="flex items-center gap-2">
						<label className="w-24 text-xs text-sidebar-fg/70">Transform</label>
						<input
							type="text"
							value={getStyleValue('transform') || ''}
							onChange={(e) => handlePropertyChange('transform', e.target.value)}
							placeholder="rotate(0deg) scale(1)"
							className="flex-1 h-6 px-2 text-xs border bg-editor-bg border-panel-border text-editor-fg focus:border-focus-border focus:outline-none"
						/>
					</div>

					<div className="flex items-center gap-2">
						<label className="w-24 text-xs text-sidebar-fg/70">Transition</label>
						<input
							type="text"
							value={getStyleValue('transition') || ''}
							onChange={(e) => handlePropertyChange('transition', e.target.value)}
							placeholder="all 0.3s ease"
							className="flex-1 h-6 px-2 text-xs border bg-editor-bg border-panel-border text-editor-fg focus:border-focus-border focus:outline-none"
						/>
					</div>

					<SelectInput
						label="Cursor"
						value={getStyleValue('cursor')}
						onChange={(v) => handlePropertyChange('cursor', v)}
						options={['auto', 'default', 'pointer', 'text', 'move', 'not-allowed', 'grab', 'grabbing']}
					/>
				</Section>
			</div>

			{/* Generated CSS Preview */}

			<div className="border-t border-panel-border">
				<div className="flex items-center justify-between px-3 py-2 bg-[#2a2a2a]">
					<span className="text-xs text-sidebar-fg/70">Generated CSS</span>
					<button
						onClick={() => {
							const css = Object.entries(inlineStyles)
								.map(([prop, val]) => `  ${prop}: ${val};`)
								.join('\n');
							navigator.clipboard.writeText(`{\n${css}\n}`);
						}}
						className="p-1 rounded hover:bg-hover"
						title="Copy CSS"
					>
						<Copy size={12} className="text-sidebar-fg/50" />
					</button>
				</div>

				<pre className="px-3 py-2 overflow-auto font-mono text-xxs text-success max-h-25">
					{Object.keys(inlineStyles).length > 0 ? (
						<>
							{'{\n'}
							{Object.entries(inlineStyles).map(([prop, val]) => (
								<div key={prop}>  {prop}: {val};</div>
							))}
							{'}'}
						</>
					) : (
						<span className="text-sidebar-fg/30">No styles applied</span>
					)}
				</pre>
			</div>
		</div>
	)
}

export default CSSDesigner;	