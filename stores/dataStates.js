import { create } from "zustand"

export const useCurrentItem = create((set) => ({
    data: {},
    set: (data) => set((current) => ({ ...current, ...data })),
    setData: (data) => set(({ data: current }) => ({ data: { ...current, ...data } })),
    resetData: () => set({ data: null }),
}))

export const useUser = create((set) => ({
    setUserData: (data) => set((current) => ({ ...current, ...data })),
    addItem: (newItem, to) =>
        set(({ data }) => {
            data[to].nextID++
            data[to].items.push(newItem)
            return { data: data }
        }),
    updateItem: (updatedItem, of) =>
        set(({ data }) => {
            data[of].items = data[of].items.map((item) => (item.id === updatedItem.id ? updatedItem : item))
            return { data: data }
        }),
}))
