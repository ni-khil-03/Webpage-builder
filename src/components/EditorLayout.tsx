import { useState } from 'react';
import {
    DndContext,
    DragOverlay,
    useSensor,
    useSensors,
    PointerSensor,
    type DragStartEvent,
    type DragEndEvent,
    type DragOverEvent
} from '@dnd-kit/core';
import { Sidebar } from './Sidebar';
import { Canvas } from './Canvas';
import { PropertiesPanel } from './PropertiesPanel';
import { useEditorStore } from '../store/useEditorStore';
import type { EditorElement } from '../types';
import { createPortal } from 'react-dom';

export const EditorLayout = () => {
    const { addElement, reorderElements, updateElement, pages, currentPageId } = useEditorStore();
    const [activeDragItem, setActiveDragItem] = useState<any>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveDragItem(event.active.data.current);
    };

    const handleDragOver = (_event: DragOverEvent) => {
        // Optional: Handle drag over logic if needed for nested containers
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveDragItem(null);

        if (!over) return;

        // Dropping a sidebar item onto the canvas
        if (active.data.current?.isSidebarItem && over.id === 'canvas-droppable') {
            const type = active.data.current.type;
            const newElement: EditorElement = {
                id: crypto.randomUUID(),
                type,
                content: type === 'text' ? 'Double click to edit' : type === 'button' ? 'Click Me' : undefined,
                style: {
                    padding: '10px',
                    backgroundColor: type === 'button' ? '#3b82f6' : 'transparent',
                    color: type === 'button' ? '#ffffff' : '#000000',
                    borderRadius: '4px',
                    width: type === 'image' ? '200px' : 'auto',
                    height: type === 'image' ? '200px' : 'auto',
                    display: 'block',
                    position: 'static', // Default to static
                },
            };
            addElement(newElement);
        }
        // Moving elements on the canvas
        else if (!active.data.current?.isSidebarItem) {
            const currentPage = pages.find(p => p.id === currentPageId);
            const activeElement = currentPage?.elements.find(el => el.id === active.id);

            // Handle absolute positioning movement
            if (activeElement && activeElement.style.position === 'absolute') {
                const currentLeft = parseInt(activeElement.style.left?.toString().replace('px', '') || '0');
                const currentTop = parseInt(activeElement.style.top?.toString().replace('px', '') || '0');

                updateElement(active.id as string, {
                    style: {
                        ...activeElement.style,
                        left: `${currentLeft + event.delta.x}px`,
                        top: `${currentTop + event.delta.y}px`,
                    }
                });
            }
            // Handle reordering for static/relative elements
            else if (over.id !== 'canvas-droppable' && active.id !== over.id) {
                reorderElements(active.id as string, over.id as string);
            }
        }
    };

    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className="flex h-screen w-screen overflow-hidden bg-gray-900">
                <Sidebar />
                <Canvas />
                <PropertiesPanel />
            </div>

            {createPortal(
                <DragOverlay>
                    {activeDragItem ? (
                        <div className="p-4 bg-gray-800 rounded-lg shadow-xl border border-gray-700 opacity-80 text-white">
                            {activeDragItem.type || 'Element'}
                        </div>
                    ) : null}
                </DragOverlay>,
                document.body
            )}
        </DndContext>
    );
};
