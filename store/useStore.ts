import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Template, Category } from '../types';
import { INITIAL_TEMPLATES, CATEGORIES } from '../constants';

interface AppState {
  // Data State
  templates: Template[];
  categories: Category[];
  
  // UI State
  selectedCategoryId: string;
  selectedTemplateId: string | null;
  searchQuery: string;
  
  // Actions
  setCategory: (id: string) => void;
  selectTemplate: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  updateTemplate: (id: string, updates: Partial<Template>) => void;
  resetTemplate: (id: string) => void;
  resetAll: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      templates: INITIAL_TEMPLATES,
      categories: CATEGORIES,
      selectedCategoryId: 'all',
      selectedTemplateId: null,
      searchQuery: '',

      setCategory: (id) => set({ 
        selectedCategoryId: id, 
        selectedTemplateId: null, // Deselect template when changing category
        searchQuery: '' // Clear search when changing category
      }),

      selectTemplate: (id) => set({ selectedTemplateId: id }),

      setSearchQuery: (query) => set({ searchQuery: query }),

      updateTemplate: (id, updates) => set((state) => ({
        templates: state.templates.map((t) => 
          t.id === id ? { ...t, ...updates } : t
        )
      })),

      // Reset a specific template to its initial state
      resetTemplate: (id) => set((state) => {
        const initialTemplate = INITIAL_TEMPLATES.find(t => t.id === id);
        if (!initialTemplate) return state; // Should not happen for known templates
        
        return {
          templates: state.templates.map(t => t.id === id ? { ...initialTemplate } : t)
        };
      }),

      // Factory reset
      resetAll: () => set({ 
        templates: INITIAL_TEMPLATES,
        selectedCategoryId: 'all',
        selectedTemplateId: null,
        searchQuery: ''
      })
    }),
    {
      name: 'quickcomms-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage),
      // Optional: Filter what is persisted. For now, we persist everything.
    }
  )
);