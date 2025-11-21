import { create } from 'zustand';
import type { EditorState, Page, EditorElement } from '../types';
import { arrayMove } from '@dnd-kit/sortable';

const initialPage: Page = {
    id: 'home',
    name: 'Home',
    slug: '/',
    elements: [],
};

export const useEditorStore = create<EditorState>((set) => ({
    pages: [initialPage],
    currentPageId: 'home',
    selectedElementId: null,

    addPage: (name) =>
        set((state) => {
            const newPage: Page = {
                id: crypto.randomUUID(),
                name,
                slug: `/${name.toLowerCase().replace(/\s+/g, '-')}`,
                elements: [],
            };
            return { pages: [...state.pages, newPage], currentPageId: newPage.id };
        }),

    switchPage: (pageId) => set({ currentPageId: pageId, selectedElementId: null }),

    deletePage: (pageId) =>
        set((state) => {
            if (state.pages.length <= 1) return state; // Cannot delete the last page
            const newPages = state.pages.filter((p) => p.id !== pageId);
            return {
                pages: newPages,
                currentPageId: state.currentPageId === pageId ? newPages[0].id : state.currentPageId,
            };
        }),

    addElement: (element) =>
        set((state) => {
            const updatedPages = state.pages.map((page) => {
                if (page.id === state.currentPageId) {
                    return { ...page, elements: [...page.elements, element] };
                }
                return page;
            });
            return { pages: updatedPages, selectedElementId: element.id };
        }),

    updateElement: (id, updates) =>
        set((state) => {
            const updatedPages = state.pages.map((page) => {
                if (page.id === state.currentPageId) {
                    const updateRecursive = (elements: EditorElement[]): EditorElement[] => {
                        return elements.map((el) => {
                            if (el.id === id) {
                                return { ...el, ...updates };
                            }
                            if (el.children) {
                                return { ...el, children: updateRecursive(el.children) };
                            }
                            return el;
                        });
                    };
                    return { ...page, elements: updateRecursive(page.elements) };
                }
                return page;
            });
            return { pages: updatedPages };
        }),

    removeElement: (id) =>
        set((state) => {
            const updatedPages = state.pages.map((page) => {
                if (page.id === state.currentPageId) {
                    const removeRecursive = (elements: EditorElement[]): EditorElement[] => {
                        return elements.filter(el => el.id !== id).map(el => {
                            if (el.children) {
                                return { ...el, children: removeRecursive(el.children) }
                            }
                            return el;
                        })
                    }
                    return { ...page, elements: removeRecursive(page.elements) };
                }
                return page;
            });
            return { pages: updatedPages, selectedElementId: null };
        }),

    selectElement: (id) => set({ selectedElementId: id }),

    reorderElements: (activeId, overId) =>
        set((state) => {
            const updatedPages = state.pages.map((page) => {
                if (page.id === state.currentPageId) {
                    const oldIndex = page.elements.findIndex((el) => el.id === activeId);
                    const newIndex = page.elements.findIndex((el) => el.id === overId);
                    if (oldIndex !== -1 && newIndex !== -1) {
                        return { ...page, elements: arrayMove(page.elements, oldIndex, newIndex) };
                    }
                }
                return page;
            });
            return { pages: updatedPages };
        }),
}));
