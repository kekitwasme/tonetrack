import { create } from "zustand"

export const useUser = create((set) => ({
    set: (data) => set((current) => ({ ...current, ...data })),
}))
