import {create} from "zustand";

export type Theme = "light" | "dark";

type State = {
  theme: Theme;
};

type Actions = {
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

/*
 * TODO: Persist theme to local storage
 * Can be done with persist middleware
 */
export const useThemeStore = create<State & Actions>((set) => ({
  theme: "light",
  setTheme: (theme) => set({theme}),
  toggleTheme: () =>
    set((state) => ({theme: state.theme === "light" ? "dark" : "light"})),
}));

useThemeStore.subscribe((state) => {
  applyThemePreference(state.theme);
});

export const applyThemePreference = (theme: Theme) => {
  const root = window.document.documentElement;

  root.classList.remove(theme === "dark" ? "light" : "dark");
  root.classList.add(theme);
};
