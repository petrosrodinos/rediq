import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface ActiveProjectState {
    activeProjectId: string | null;
    activeProjectName: string | null;
    setActiveProject: (project: { id: string; name: string }) => void;
    clearActiveProject: () => void;
}

const STORE_KEY = "active-project";

export const useActiveProjectStore = create<ActiveProjectState>()(
    devtools(
        persist(
            (set) => ({
                activeProjectId: null,
                activeProjectName: null,
                setActiveProject: ({ id, name }) => set({ activeProjectId: id, activeProjectName: name }),
                clearActiveProject: () => set({ activeProjectId: null, activeProjectName: null }),
            }),
            { name: STORE_KEY },
        ),
    ),
);

export const getActiveProjectStoreState = () => useActiveProjectStore.getState();
