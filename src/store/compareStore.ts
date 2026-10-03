import { create } from 'zustand';

interface CompareStore {
  selectedPerfumes: string[];
  addPerfume: (id: string) => void;
  removePerfume: (id: string) => void;
  clearPerfumes: () => void;
}

export const useCompareStore = create<CompareStore>((set) => ({
  selectedPerfumes: [],
  addPerfume: (id) =>
    set((state) => {
      if (state.selectedPerfumes.length >= 2) {
        return state; // 최대 2개만 선택 가능
      }
      if (state.selectedPerfumes.includes(id)) {
        return state; // 이미 선택된 향수
      }
      return { selectedPerfumes: [...state.selectedPerfumes, id] };
    }),
  removePerfume: (id) =>
    set((state) => ({
      selectedPerfumes: state.selectedPerfumes.filter((pid) => pid !== id),
    })),
  clearPerfumes: () => set({ selectedPerfumes: [] }),
}));