export type ElementType = 'text' | 'image' | 'button' | 'container' | 'video';

export interface EditorElement {
    id: string;
    type: ElementType;
    content?: string;
    src?: string;
    linkToPageId?: string;
    apiEndpoint?: string;
    style: React.CSSProperties;
    children?: EditorElement[]; // For container elements
}

export interface Page {
    id: string;
    name: string;
    slug: string;
    elements: EditorElement[];
}

export interface EditorState {
    pages: Page[];
    currentPageId: string;
    selectedElementId: string | null;

    // Actions
    addPage: (name: string) => void;
    switchPage: (pageId: string) => void;
    deletePage: (pageId: string) => void;

    addElement: (element: EditorElement) => void;
    updateElement: (id: string, updates: Partial<EditorElement>) => void;
    removeElement: (id: string) => void;
    selectElement: (id: string | null) => void;
    reorderElements: (activeId: string, overId: string) => void;
}
