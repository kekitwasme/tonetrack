import { create } from "zustand"

export const useExpandItemCard = create((set) => ({
    expand: false,
    set: (data) => set((current) => ({ ...current, ...data })),
}))

export const useMenu = create((set) => ({
    visible: false,
    selected: null,
    set: (data) => set((current) => ({ ...current, ...data })),
}))

export const useNavigationBar = create((set) => ({
    visible: true,
    selected: "tasks",
    set: (data) => set((current) => ({ ...current, ...data })),
}))
