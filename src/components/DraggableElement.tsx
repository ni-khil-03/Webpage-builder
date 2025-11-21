import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { EditorElement } from '../types';
import { useEditorStore } from '../store/useEditorStore';
import { clsx } from 'clsx';

interface DraggableElementProps {
    element: EditorElement;
    isSelected: boolean;
}

export const DraggableElement = ({ element, isSelected }: DraggableElementProps) => {
    const { selectElement, updateElement } = useEditorStore();
    const elementRef = React.useRef<HTMLDivElement>(null);
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: element.id, data: { type: element.type, element } });

    // Merge refs
    const setRefs = (node: HTMLDivElement | null) => {
        setNodeRef(node);
        // @ts-ignore
        elementRef.current = node;
    };

    const handleResizeMouseDown = (e: React.MouseEvent, direction: string) => {
        e.stopPropagation(); // Prevent drag start
        e.preventDefault(); // Prevent text selection

        if (!elementRef.current) return;

        const startX = e.clientX;
        const startY = e.clientY;
        const rect = elementRef.current.getBoundingClientRect();
        const startWidth = rect.width;
        const startHeight = rect.height;
        // For absolute positioning, we need the current style values or computed values relative to parent
        // But for simplicity, let's rely on the store's style if available, or fallback to 0 (which might be buggy for initial relative moves)
        // Better: Read computed style for left/top if not set? 
        // Actually, if it's static, left/top don't matter. If absolute, they should be in the store or computed.
        const startLeft = parseInt(element.style.left?.toString().replace('px', '') || '0') || elementRef.current.offsetLeft;
        const startTop = parseInt(element.style.top?.toString().replace('px', '') || '0') || elementRef.current.offsetTop;

        const onMouseMove = (moveEvent: MouseEvent) => {
            moveEvent.preventDefault();
            const deltaX = moveEvent.clientX - startX;
            const deltaY = moveEvent.clientY - startY;

            let newWidth = startWidth;
            let newHeight = startHeight;
            let newLeft = startLeft;
            let newTop = startTop;

            if (direction.includes('e')) newWidth = Math.max(10, startWidth + deltaX);
            if (direction.includes('s')) newHeight = Math.max(10, startHeight + deltaY);
            if (direction.includes('w')) {
                newWidth = Math.max(10, startWidth - deltaX);
                if (element.style.position === 'absolute') {
                    newLeft = startLeft + (startWidth - newWidth); // Adjust left by the change in width
                    // Actually simpler: newLeft = startLeft + deltaX. 
                    // But we need to clamp deltaX so width doesn't go below min.
                    // If width is clamped, left shouldn't move further.
                    // Let's stick to simple delta for now.
                    newLeft = startLeft + deltaX;
                }
            }
            if (direction.includes('n')) {
                newHeight = Math.max(10, startHeight - deltaY);
                if (element.style.position === 'absolute') {
                    newTop = startTop + deltaY;
                }
            }

            updateElement(element.id, {
                style: {
                    ...element.style,
                    width: `${newWidth}px`,
                    height: `${newHeight}px`,
                    ...(element.style.position === 'absolute' ? { left: `${newLeft}px`, top: `${newTop}px` } : {})
                }
            });
        };

        const onMouseUp = () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    };

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        ...element.style,
    };

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        selectElement(element.id);
    };

    const renderContent = () => {
        switch (element.type) {
            case 'text':
                return <p>{element.content}</p>;
            case 'button':
                return <button className="pointer-events-none">{element.content}</button>;
            case 'image':
                return (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        {element.src ? (
                            <img src={element.src} alt="User uploaded" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-gray-400">Image Placeholder</span>
                        )}
                    </div>
                );
            case 'container':
                return <div className="min-h-[50px] border-dashed border border-gray-300 p-2">{element.children?.length ? 'Container Content' : 'Empty Container'}</div>;
            default:
                return null;
        }
    };

    return (
        <div
            ref={setRefs}
            style={style}
            {...attributes}
            {...listeners}
            onClick={handleClick}
            className={clsx(
                "relative group cursor-move",
                isSelected && "ring-2 ring-blue-500 ring-offset-2",
                isDragging && "opacity-50"
            )}
        >
            {renderContent()}

            {isSelected && (
                <>
                    {/* Resize Handles */}
                    <div
                        className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border border-blue-500 rounded-full cursor-nw-resize z-50 hover:bg-blue-100"
                        onMouseDown={(e) => handleResizeMouseDown(e, 'nw')}
                    />
                    <div
                        className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border border-blue-500 rounded-full cursor-ne-resize z-50 hover:bg-blue-100"
                        onMouseDown={(e) => handleResizeMouseDown(e, 'ne')}
                    />
                    <div
                        className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border border-blue-500 rounded-full cursor-sw-resize z-50 hover:bg-blue-100"
                        onMouseDown={(e) => handleResizeMouseDown(e, 'sw')}
                    />
                    <div
                        className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border border-blue-500 rounded-full cursor-se-resize z-50 hover:bg-blue-100"
                        onMouseDown={(e) => handleResizeMouseDown(e, 'se')}
                    />
                </>
            )}
        </div>
    );
};
