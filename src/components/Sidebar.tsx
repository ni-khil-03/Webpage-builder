import { useEditorStore } from '../store/useEditorStore';
import { Type, Image, Square, MousePointer2, Layout, Eye } from 'lucide-react';
import { useDraggable } from '@dnd-kit/core';
import { useNavigate } from 'react-router-dom';

const SidebarItem = ({ type, icon: Icon, label }: { type: string; icon: any; label: string }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: `sidebar-${type}`,
        data: { type, isSidebarItem: true },
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            style={style}
            className="flex flex-col items-center justify-center p-4 bg-gray-800 rounded-lg cursor-grab hover:bg-gray-700 transition-colors border border-gray-700"
        >
            <Icon className="w-6 h-6 mb-2 text-gray-300" />
            <span className="text-xs text-gray-400">{label}</span>
        </div>
    );
};

export const Sidebar = () => {
    const { pages, addPage, currentPageId, switchPage, deletePage } = useEditorStore();
    const navigate = useNavigate();

    return (
        <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col h-full text-white">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    WebBuilder
                </h1>
                <button
                    onClick={() => navigate('/preview')}
                    className="p-2 hover:bg-gray-800 rounded text-gray-400 hover:text-white"
                    title="Preview"
                >
                    <Eye className="w-5 h-5" />
                </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Elements</h2>
                <div className="grid grid-cols-2 gap-3">
                    <SidebarItem type="text" icon={Type} label="Text" />
                    <SidebarItem type="image" icon={Image} label="Image" />
                    <SidebarItem type="button" icon={MousePointer2} label="Button" />
                    <SidebarItem type="container" icon={Square} label="Container" />
                </div>

                <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pages</h2>
                        <button
                            onClick={() => addPage('New Page')}
                            className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-white"
                        >
                            +
                        </button>
                    </div>
                    <div className="space-y-1">
                        {pages.map((page) => (
                            <div
                                key={page.id}
                                className={`flex items-center justify-between px-3 py-2 rounded cursor-pointer group ${currentPageId === page.id ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800/50'
                                    }`}
                                onClick={() => switchPage(page.id)}
                            >
                                <div className="flex items-center gap-2">
                                    <Layout className="w-4 h-4" />
                                    <span className="text-sm truncate">{page.name}</span>
                                </div>
                                {pages.length > 1 && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); deletePage(page.id); }}
                                        className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
