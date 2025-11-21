import { useEditorStore } from '../store/useEditorStore';
import { Trash2, Link as LinkIcon, Globe } from 'lucide-react';

export const PropertiesPanel = () => {
    const { selectedElementId, pages, currentPageId, updateElement, removeElement } = useEditorStore();

    const currentPage = pages.find(p => p.id === currentPageId);
    const selectedElement = currentPage?.elements.find(el => el.id === selectedElementId);

    if (!selectedElement) {
        return (
            <div className="w-64 bg-gray-900 border-l border-gray-800 p-4 text-gray-400 text-sm flex items-center justify-center h-full">
                Select an element to edit
            </div>
        );
    }

    const handleStyleChange = (property: string, value: string) => {
        updateElement(selectedElement.id, {
            style: { ...selectedElement.style, [property]: value }
        });
    };

    const handleContentChange = (value: string) => {
        updateElement(selectedElement.id, { content: value });
    };

    return (
        <div className="w-80 bg-gray-900 border-l border-gray-800 flex flex-col h-full text-white overflow-y-auto">
            <div className="p-4 border-b border-gray-800">
                <h2 className="font-semibold">Properties</h2>
                <p className="text-xs text-gray-500 mt-1 capitalize">{selectedElement.type}</p>
            </div>

            <div className="p-4 space-y-6">
                {/* Content Editing */}
                {(selectedElement.type === 'text' || selectedElement.type === 'button') && (
                    <div className="space-y-2">
                        <label className="text-xs text-gray-400">Content</label>
                        <input
                            type="text"
                            value={selectedElement.content || ''}
                            onChange={(e) => handleContentChange(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                        />
                    </div>
                )}

                {/* Link Editing for Buttons */}
                {selectedElement.type === 'button' && (
                    <div className="space-y-2">
                        <label className="text-xs text-gray-400 flex items-center gap-2">
                            <LinkIcon className="w-3 h-3" />
                            Link to Page
                        </label>
                        <select
                            value={selectedElement.linkToPageId || ''}
                            onChange={(e) => updateElement(selectedElement.id, { linkToPageId: e.target.value })}
                            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                        >
                            <option value="">None</option>
                            {pages.map(page => (
                                <option key={page.id} value={page.id}>
                                    {page.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* API Endpoint for Buttons */}
                {selectedElement.type === 'button' && (
                    <div className="space-y-2">
                        <label className="text-xs text-gray-400 flex items-center gap-2">
                            <Globe className="w-3 h-3" />
                            API Endpoint (GET)
                        </label>
                        <input
                            type="text"
                            value={selectedElement.apiEndpoint || ''}
                            onChange={(e) => updateElement(selectedElement.id, { apiEndpoint: e.target.value })}
                            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                            placeholder="https://api.example.com/data"
                        />
                    </div>
                )}

                {/* Image Editing */}
                {selectedElement.type === 'image' && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs text-gray-400">Image Source</label>
                            <div className="flex flex-col gap-2">
                                <input
                                    type="text"
                                    value={selectedElement.src || ''}
                                    onChange={(e) => updateElement(selectedElement.id, { src: e.target.value })}
                                    className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                                    placeholder="https://example.com/image.jpg"
                                />
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    updateElement(selectedElement.id, { src: reader.result as string });
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                        className="hidden"
                                        id="image-upload"
                                    />
                                    <label
                                        htmlFor="image-upload"
                                        className="flex items-center justify-center w-full px-3 py-2 text-sm bg-gray-800 border border-gray-700 border-dashed rounded cursor-pointer hover:bg-gray-700 hover:border-gray-600 transition-colors"
                                    >
                                        <span className="text-gray-400">Upload Image</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Style Editing */}
                <div className="space-y-4">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Appearance</h3>

                    <div className="space-y-2">
                        <label className="text-xs text-gray-400">Background Color</label>
                        <div className="flex gap-2">
                            <input
                                type="color"
                                value={selectedElement.style.backgroundColor as string || '#ffffff'}
                                onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                                className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
                            />
                            <input
                                type="text"
                                value={selectedElement.style.backgroundColor as string || ''}
                                onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                                className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-1 text-sm"
                                placeholder="#ffffff"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs text-gray-400">Text Color</label>
                        <div className="flex gap-2">
                            <input
                                type="color"
                                value={selectedElement.style.color as string || '#000000'}
                                onChange={(e) => handleStyleChange('color', e.target.value)}
                                className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
                            />
                            <input
                                type="text"
                                value={selectedElement.style.color as string || ''}
                                onChange={(e) => handleStyleChange('color', e.target.value)}
                                className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-1 text-sm"
                                placeholder="#000000"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs text-gray-400">Padding (px)</label>
                            <input
                                type="text"
                                value={selectedElement.style.padding?.toString().replace('px', '') || '0'}
                                onChange={(e) => handleStyleChange('padding', `${e.target.value}px`)}
                                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs text-gray-400">Radius (px)</label>
                            <input
                                type="text"
                                value={selectedElement.style.borderRadius?.toString().replace('px', '') || '0'}
                                onChange={(e) => handleStyleChange('borderRadius', `${e.target.value}px`)}
                                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs text-gray-400">Width</label>
                            <input
                                type="text"
                                value={selectedElement.style.width?.toString() || 'auto'}
                                onChange={(e) => handleStyleChange('width', e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs text-gray-400">Height</label>
                            <input
                                type="text"
                                value={selectedElement.style.height?.toString() || 'auto'}
                                onChange={(e) => handleStyleChange('height', e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Position Editing */}
                <div className="space-y-4 border-t border-gray-800 pt-4">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Position</h3>
                    <div className="space-y-2">
                        <label className="text-xs text-gray-400">Type</label>
                        <select
                            value={selectedElement.style.position || 'static'}
                            onChange={(e) => handleStyleChange('position', e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                        >
                            <option value="static">Static (Flow)</option>
                            <option value="relative">Relative</option>
                            <option value="absolute">Absolute</option>
                            <option value="fixed">Fixed</option>
                        </select>
                    </div>

                    {(selectedElement.style.position === 'absolute' || selectedElement.style.position === 'relative' || selectedElement.style.position === 'fixed') && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs text-gray-400">Top (px)</label>
                                <input
                                    type="text"
                                    value={selectedElement.style.top?.toString().replace('px', '') || '0'}
                                    onChange={(e) => handleStyleChange('top', `${e.target.value}px`)}
                                    className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs text-gray-400">Left (px)</label>
                                <input
                                    type="text"
                                    value={selectedElement.style.left?.toString().replace('px', '') || '0'}
                                    onChange={(e) => handleStyleChange('left', `${e.target.value}px`)}
                                    className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm"
                                />
                            </div>
                            <div className="space-y-2 col-span-2">
                                <label className="text-xs text-gray-400">Layer (Z-Index)</label>
                                <input
                                    type="number"
                                    value={selectedElement.style.zIndex?.toString() || ''}
                                    onChange={(e) => handleStyleChange('zIndex', e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm"
                                    placeholder="auto"
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="pt-4 border-t border-gray-800">
                    <button
                        onClick={() => removeElement(selectedElement.id)}
                        className="w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 py-2 rounded transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete Element
                    </button>
                </div>
            </div>
        </div>
    );
};
