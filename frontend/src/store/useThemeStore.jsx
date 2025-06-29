import { create } from 'zustand'

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("globletalk-theme")||"coffee",
  setTheme:(theme)=>{
    localStorage.setItem("globetalk-theme",theme);
    set({theme});
  },
}));
