import { useEditorStore } from '../store/useEditorStore';
import type { EditorElement } from '../types';

const PreviewElement = ({ element }: { element: EditorElement }) => {
    const handleClick = async () => {
        if (element.type === 'button') {
            if (element.linkToPageId) {
                useEditorStore.getState().switchPage(element.linkToPageId);
            }

            if (element.apiEndpoint) {
                try {
                    const response = await fetch(element.apiEndpoint);
                    const data = await response.json();
                    alert(`API Response:\n${JSON.stringify(data, null, 2)}`);
                } catch (error) {
                    alert(`API Error:\n${error}`);
                }
            }
        }
    };

    const renderContent = () => {
        switch (element.type) {
            case 'text':
                return <p>{element.content}</p>;
            case 'button':
                return <button onClick={handleClick} className="w-full h-full">{element.content}</button>;
            case 'image':
                return (
                    <div className="w-full h-full flex items-center justify-center overflow-hidden">
                        {element.src ? (
                            <img src={element.src} alt="User uploaded" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-gray-400">Image Placeholder</span>
                        )}
                    </div>
                );
            case 'container':
                return (
                    <div className="w-full h-full">
                        {element.children?.map(child => <PreviewElement key={child.id} element={child} />)}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div style={element.style}>
            {renderContent()}
        </div>
    );
};

export const Preview = () => {
    const { pages, currentPageId } = useEditorStore();
    const currentPage = pages.find((p) => p.id === currentPageId);

    if (!currentPage) return <div>Page not found</div>;

    return (
        <div className="min-h-screen bg-white">
            {currentPage.elements.map((element) => (
                <PreviewElement key={element.id} element={element} />
            ))}
        </div>
    );
};
