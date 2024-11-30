import { create } from "zustand";

interface CharacterStore {
  tags: string[];
  inputValue: string;
  results: any[];
  setTags: (tags: string[]) => void;
  addTag: (name: string) => void;
  removeTag: (index: number) => void;
  setInputValue: (value: string) => void;
  setResults: (results: any[]) => void;
}

export const useCharacterStore = create<CharacterStore>((set: any) => ({
  tags: [],
  inputValue: "",
  results: [],
  setTags: (tags: any) => set({ tags }),
  addTag: (name: any) =>
    set((state: any) => ({
      tags: state.tags.includes(name) ? state.tags : [...state.tags, name],
    })),
  removeTag: (index: any) =>
    set((state: any) => ({
      tags: state.tags.filter((_, i) => i !== index),
    })),
  setInputValue: (value: any) => set({ inputValue: value }),
  setResults: (results: any) => set({ results }),
}));
