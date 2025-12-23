import type React from 'react';
import { ariaAttributes, buttonTypes, elementAttributes, eventHandlers, inputTypes, linkRelValues, linkTargets, removeAttribute, setActiveTab, updateAttribute } from './propertiesSlice';
import { Accessibility, ChevronDown, ChevronUp, Code, Copy, Info, Plus, Trash2, Zap } from 'lucide-react';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hook/useRedux';

// Attribute input component
const AttributeInput: React.FC<{
	name: string;
	value: string;
	tagName: string;
	onChange: (value: string) => void;
	onRemove: () => void;
}> = ({ name, value, tagName, onChange, onRemove }) => {
	// Determine input type based on attribute
	const getBooleanAttributes = () => [
		'disabled', 'readonly', 'required', 'checked', 'selected', 'multiple',
		'hidden', 'autoplay', 'controls', 'loop', 'muted', 'open', 'async',
		'defer', 'novalidate', 'autofocus', 'reversed',
	];

	const isBooleanAttr = getBooleanAttributes().includes(name);

	// Get options for select-type attributes
	const getOptions = (): string[] | null => {
		if (name === 'type' && tagName === 'input') return inputTypes;
		if (name === 'type' && tagName === 'button') return buttonTypes;
		if (name === 'target') return linkTargets;
		if (name === 'rel' && tagName === 'a') return linkRelValues;
		if (name === 'method') return ['get', 'post'];
		if (name === 'enctype') return ['application/x-www-form-urlencoded', 'multipart/form-data', 'text/plain'];
		if (name === 'loading') return ['lazy', 'eager'];
		if (name === 'decoding') return ['sync', 'async', 'auto'];
		if (name === 'preload') return ['none', 'metadata', 'auto'];
		if (name === 'wrap') return ['soft', 'hard'];
		if (name === 'dir') return ['ltr', 'rtl', 'auto'];
		if (name === 'autocomplete') return ['on', 'off'];
		if (name === 'scope') return ['row', 'col', 'rowgroup', 'colgroup'];
		return null;
	}

	const options = getOptions();

	return (
		<div className='flex items-center gap-2 py-1.5 px-2 hover:bg-hover rounded group'>
			<label className='text-xs truncate text-sidebar-fg/70 w-28' title={name}>{name}</label>
			{isBooleanAttr ? (
				<input
					type='checkbox'
					checked={value === 'true' || value === name || value !== ''}
					onChange={e => onChange(e.target.checked ? name : '')}
					className='w-4 h-4 accent-accent'
				/>

			) : options ? (
				<select
					onChange={e => onChange(e.target.value)}
					value={value}
					className='flex-1 h-6 px-2 text-xs border rounded bg-editor-bg border-panel-border text-editor-fg focus:border-focus-border focus:outline-none'
				>
					<option value="">--</option>
					{options.map(opt => (
						<option key={opt} value={opt}>{opt}</option>
					))}
				</select>
			) : (
				<input
					type="text"
					value={value}
					onChange={e => onChange(e.target.value)}
					className='flex-1 h-6 px-2 text-xs border rounded bg-editor-bg border-panel-border text-editor-fg focus:border-focus-border focus:outline-none'
					placeholder={`Enter ${name}`}
				/>
			)}
			<button
				onClick={onRemove}
				className='p-1 transition-opacity rounded opacity-0 group-hover:opacity-100 hover:bg-error/20'
				title={'Remove attribute'}
			>
				<Trash2 size={12} className='text-error' />
			</button>
		</div>
	)
}

// Add attributes dropdown
const AddAttributeDropdown: React.FC<{
	tagName: string;
	existingAttributes: string[];
	onAdd: (name: string) => void;
}> = ({ tagName, existingAttributes, onAdd }) => {
	const [isOpen, setIsOpen] = useState(false)
	const [search, setSearch] = useState('')

	// Get available attributes for this element
	const getAvailableAttributes = () => {
		const globalAttrs = elementAttributes._global || [];
		const elementAttrs = elementAttributes[tagName.toLowerCase()] || [];
		const allAttrs = [...new Set([...globalAttrs, ...elementAttrs])];
		return allAttrs.filter(attr => !existingAttributes.includes(attr));
	};

	const availableAttributes = getAvailableAttributes().filter(attr => attr.toLowerCase().includes(search.toLowerCase()));

	return (
		<div className='relative'>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className='flex items-center gap-1 px-2 py-1 text-xs rounded text-accent hover:bg-hover'
			>
				<Plus size={12} />
				Add Attribute
			</button>

			{isOpen && (
				<>
					<div
						className='fixed inset-0 z-40'
						onClick={() => setIsOpen(false)}
					/>
					<div className="absolute top-full left-0 mt-1 w-48 bg-[#3c3c3c] border border-panel-border rounded shadow-xl z-50 max-h-50 overflow-hidden flex flex-col">
						<input
							type='text'
							value={search}
							onChange={e => setSearch(e.target.value)}
							placeholder='Search attributes...'
							className='px-2 py-1.5 bg-editor-bg border-b border-panel-border text-xs text-editor-fg focus:outline-none'
							autoFocus
						/>
						<div className="flex-1 overflow-y-auto">
							{availableAttributes.length > 0 ? (
								availableAttributes.map((attr) => (
									<button
										key={attr}
										onClick={() => {
											onAdd(attr)
											setIsOpen(false);
											setSearch('')
										}}
										className='w-full px-2 py-1.5 text-xs text-left text-editor-fg hover:bg-accent'
									>
										{attr}
									</button>
								))
							) : (
								<div className='px-2 py-4 text-xs text-center text-sidebar-fg/50'>
									No attributes available
								</div>
							)}
						</div>
					</div>
				</>
			)}
		</div>
	)
}

const Section: React.FC<{
	title: string;
	icon: React.ReactNode;
	defaultOpen?: boolean;
	children?: React.ReactNode;
	action?: React.ReactNode;
}> = ({ title, icon, defaultOpen, children, action }) => {
	const [isOpen, setIsOpen] = useState(defaultOpen);

	return (
		<div className="border-b border-panel-border">
			<div className="flex items-center justify-between py-1 5 hover:bg-hover">
				<button
					onClick={() => setIsOpen(!isOpen)}
					className='flex items-center gap-2 text-xs text-sidebar-fg'
				>
					{isOpen ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
					{icon}
					<span>{title}</span>
				</button>
				{action}
			</div>
			{isOpen && <div className='pb-2'>{children}</div>}
		</div>
	)
}

const PropertiesPanel: React.FC = () => {
	const dispatch = useAppDispatch();
	const { selectedElement, activeTab } = useAppSelector(s => s.properties)

	const handleUpdateAttribute = (name: string, value: string) => {
		dispatch(updateAttribute({ name, value }))
	}

	const handleRemoveAttribute = (name: string) => {
		dispatch(removeAttribute(name))
	}

	const handleAddAttribute = (name: string) => {
		dispatch(updateAttribute({ name, value: '' }))
	}

	// Generate HTML For selected Element
	const generateHTML = () => {
		if (!selectedElement) return '';

		const attrs = selectedElement.attributes.filter(a => a.value).map(a => `${a.name}=${a.value}`).join(' ');
		const openTag = attrs ? `<${selectedElement.tagName} ${attrs}>` : `<${selectedElement.tagName}>`;
		const voidElements = ['img', 'br', 'hr', 'input', 'meta', 'link', 'area', 'base', 'col', 'embed', 'param', 'source', 'track', 'wbr'];
		if (voidElements.includes(selectedElement.tagName.toLowerCase())) {
			return openTag.replace('>', ' />');
		}

		return `${openTag}...&lt;/${selectedElement.tagName}>`;
	};

	// Get attributes grouped
	const getGroupedAttributes = () => {
		if (!selectedElement) return { standard: [], aria: [], event: [], data: [], other: [] };

		const standard: { name: string; value: string }[] = [];
		const aria: { name: string; value: string }[] = [];
		const event: { name: string; value: string }[] = [];
		const data: { name: string; value: string }[] = [];
		const other: { name: string; value: string }[] = [];

		selectedElement.attributes.forEach((attr) => {
			if (attr.name.startsWith('aria-') || attr.name === 'role') {
				aria.push(attr)
			} else if (attr.name.startsWith('on')) {
				aria.push(attr)
			} else if (attr.name.startsWith('data-')) {
				aria.push(attr)
			} else {
				const globalAttrs = elementAttributes._global || [];
				const elementAttrs = elementAttributes[selectedElement.tagName.toLowerCase()] || [];
				if ([...globalAttrs, ...elementAttrs].includes(attr.name)) {
					standard.push(attr)
				} else {
					other.push(attr)
				}
			}
		});

		return { standard, aria, event, data, other }
	}

	const groupedAttrs = getGroupedAttributes();

	return (
		<div className="flex flex-col h-full overflow-hidden bg-sidebar-bg text-sidebar-fg" >
			{/* Headers */}
			<div className="flex items-center justify-between h-8.75 px-3 border-b border-panel-border">
				<span className="text-xs font-medium">Properties</span>
			</div>

			{/* Tabs */}
			<div className="flex border-b border-panel-border">
				{[
					{ id: 'attributes' as const, label: 'Attributes', icon: <Info size={12} /> },
					{ id: 'events' as const, label: 'Events', icon: <Zap size={12} /> },
					{ id: 'accessibility' as const, label: 'A11y', icon: <Accessibility size={12} /> },
				].map((tab) => (
					<button
						key={tab.id}
						onClick={() => dispatch(setActiveTab(tab.id))}
						className={`flex items-center gap-1.5 px-3 text-xs border-b-2 transition-colors ${activeTab === tab.id ? 'text-editor-fg border-accent' : 'text-sidebar-fg/50 border-transparent hover:text-sidebar-fg'}`}
					>
						{tab.icon}
						{tab.label}
					</button>
				))}
			</div>

			{/* Content */}
			{selectedElement ? (
				<div className='flex-1 overflow-y-auto'>
					{/* Element Info */}
					<div className="px-3 py-2 bg-[#2a2a2a] border-b border-panel-border">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Code size={14} className='text-accent' />
								<span className="font-mono text-xs">&lt;{selectedElement.tagName}</span>
							</div>
							<button
								onClick={() => navigator.clipboard.writeText(generateHTML())}
								className='p-1 rounded hover:bg-hover'
								title='Copy HTML'
							>
								<Copy size={12} className='text-sidebar-fg/50' />
							</button>
						</div>
						<div className="mt-1 truncate text-xxs text-sidebar-fg/50">{selectedElement.path}</div>
					</div>
					{activeTab === 'attributes' && (
						<>
							{/* ID & Class (always visible) */}
							<Section
								title='Identity'
								icon={<span className='text-accent'>#</span>}
								action={
									<AddAttributeDropdown
										tagName={selectedElement.tagName}
										existingAttributes={selectedElement.attributes.map(a => a.name)}
										onAdd={handleAddAttribute}
									/>
								}
							>
								<AttributeInput
									name='id'
									value={selectedElement.id}
									tagName={selectedElement.tagName}
									onChange={(v) => handleUpdateAttribute('id', v)}
									onRemove={() => handleRemoveAttribute('id')}
								/>
								<AttributeInput
									name='class'
									value={selectedElement.className}
									tagName={selectedElement.tagName}
									onChange={(v) => handleUpdateAttribute('class', v)}
									onRemove={() => handleRemoveAttribute('class')}
								/>
							</Section>

							{/* Standard Attributes */}
							{groupedAttrs.standard.length > 0 && (
								<Section title='Standard' icon={<Info size={12} />}>
									{groupedAttrs.standard
										.filter((a) => a.name !== 'id' && a.name !== 'class')
										.map((attr) => (
											<AttributeInput
												key={attr.name}
												name={attr.name}
												value={attr.value}
												tagName={selectedElement.tagName}
												onChange={v => handleUpdateAttribute(attr.name, v)}
												onRemove={() => handleRemoveAttribute(attr.name)}
											/>
										))}
								</Section>
							)}

							{/* Data Attributes */}
							{groupedAttrs.data.length > 0 && (
								<Section title='Data attributes' icon={<span className='text-yellow-400'>*</span>}>
									{groupedAttrs.data.map((attr) => (
										<AttributeInput
											key={attr.name}
											name={attr.name}
											value={attr.value}
											tagName={selectedElement.tagName}
											onChange={v => handleUpdateAttribute(attr.name, v)}
											onRemove={() => handleRemoveAttribute(attr.name)}
										/>
									))}
								</Section>
							)}

							{/* Other Attributes */}
							{groupedAttrs.other.length > 0 && (
								<Section title='Other' icon={<span className='text-gray-400'>...</span>} defaultOpen={false}>
									{groupedAttrs.other.map((attr) => (
										<AttributeInput
											key={attr.name}
											name={attr.name}
											value={attr.value}
											tagName={selectedElement.tagName}
											onChange={v => handleUpdateAttribute(attr.name, v)}
											onRemove={() => handleRemoveAttribute(attr.name)}
										/>
									))}
								</Section>
							)}
						</>
					)}

					{activeTab === 'events' && (
						<Section
							title='Event Handlers'
							icon={<Zap size={12} className='text-yellow-400' />}
							action={
								<div className='relative'>
									<select name="" id="">
										<option value="">+ Add Event</option>
										{eventHandlers
											.filter(e => !selectedElement.attributes.find(a => a.name === e))
											.map(event => (
												<option key={event} value={event}>{event}</option>
											))}
									</select>
								</div>
							}
						>
							{groupedAttrs.event.length > 0 ? (
								groupedAttrs.event.map((attr) => (
									<AttributeInput
										key={attr.name}
										value={attr.value}
										tagName={selectedElement.tagName}
										name={attr.name}
										onChange={v => handleUpdateAttribute(attr.name, v)}
										onRemove={() => handleRemoveAttribute(attr.name)}
									/>
								))
							) : (
								<div className='px-3 py-4 text-xs text-center text-sidebar-fg/50'>
									No event handlers defined
								</div>
							)}
						</Section>
					)}

					{activeTab === 'accessibility' && (
						<Section
							title="ARIA Attributes"
							icon={<Accessibility size={12} className="text-blue-400" />}
							action={
								<div className="relative">
									<select
										onChange={(e) => {
											if (e.target.value) {
												handleAddAttribute(e.target.value);
												e.target.value = '';
											}
										}}
										className="text-xs bg-transparent cursor-pointer text-accent focus:outline-none"
									>
										<option value="">+ Add ARIA</option>
										{ariaAttributes
											.filter((a) => !selectedElement.attributes.find((attr) => attr.name === a))
											.map((aria) => (
												<option key={aria} value={aria}>{aria}</option>
											))}
									</select>
								</div>
							}
						>
							{groupedAttrs.aria.length > 0 ? (
								groupedAttrs.aria.map((attr) => (
									<AttributeInput
										key={attr.name}
										name={attr.name}
										value={attr.value}
										tagName={selectedElement.tagName}
										onChange={(v) => handleUpdateAttribute(attr.name, v)}
										onRemove={() => handleRemoveAttribute(attr.name)}
									/>
								))
							) : (
								<div className="px-3 py-4 text-xs text-center text-sidebar-fg/50">
									No ARIA attributes defined.
									<br />
									<span className="text-xxs">Add accessibility attributes to improve screen reader support.</span>
								</div>
							)}
						</Section>
					)}
				</div>
			) : (
				<div className="flex items-center justify-center flex-1">
					<div className="text-center text-sidebar-fg/50">
						<Info size={32} className="mx-auto mb-2 opacity-30" />
						<p className="text-xs">Select an element to view properties</p>
						<p className="mt-1 text-xxs">Click on an element in the preview</p>
					</div>
				</div>
			)}
			{/* Quick Actions */}
			{selectedElement && (
				<div className="p-2 border-t border-panel-border">
					<div className="flex items-center gap-2">
						<button className="flex-1 px-2 py-1.5 text-xs bg-accent text-white rounded hover:bg-accent/80">
							Apply Changes
						</button>
						<button className="px-2 py-1.5 text-xs text-sidebar-fg/70 hover:bg-hover rounded">
							Reset
						</button>
					</div>
				</div>
			)}
		</div>
	)
}

export default PropertiesPanel;
