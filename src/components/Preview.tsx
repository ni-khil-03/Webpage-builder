import { useEditorStore } from '../store/useEditorStore';
import type { EditorElement } from '../types';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

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
    const navigate = useNavigate();
    const currentPage = pages.find((p) => p.id === currentPageId);

    if (!currentPage) return <div>Page not found</div>;

    return (
        <div className="min-h-screen bg-white relative">
            {currentPage.elements.map((element) => (
                <PreviewElement key={element.id} element={element} />
            ))}

            <button
                onClick={() => navigate('/editor')}
                className="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 hover:bg-gray-800 transition-colors z-50"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Editor
            </button>
        </div>
    );
};
