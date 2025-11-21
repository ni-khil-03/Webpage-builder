import { useEditorStore } from '../store/useEditorStore';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { DraggableElement } from './DraggableElement';
import { clsx } from 'clsx';

export const Canvas = () => {
    const { pages, currentPageId, selectElement, selectedElementId } = useEditorStore();
    const currentPage = pages.find((p) => p.id === currentPageId);

    const { setNodeRef, isOver } = useDroppable({
        id: 'canvas-droppable',
    });

    if (!currentPage) return null;

    return (
        <div
            className="flex-1 bg-gray-100 overflow-y-auto p-8 flex justify-center"
            onClick={() => selectElement(null)}
        >
            <div
                ref={setNodeRef}
                className={clsx(
                    "w-full max-w-4xl min-h-[800px] bg-white shadow-sm transition-colors duration-200 relative",
                    isOver && "bg-blue-50 ring-2 ring-blue-400 ring-inset"
                )}
            >
                <SortableContext
                    items={currentPage.elements.map(el => el.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {currentPage.elements.map((element) => (
                        <DraggableElement
                            key={element.id}
                            element={element}
                            isSelected={selectedElementId === element.id}
                        />
                    ))}
                </SortableContext>

                {currentPage.elements.length === 0 && (
                    <div className="h-full flex items-center justify-center text-gray-400 pointer-events-none">
                        <p>Drag elements here</p>
                    </div>
                )}
            </div>
        </div>
    );
};
