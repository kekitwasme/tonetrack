import { create } from "zustand"

export default create((set) => ({
    selected: "todos",
    setSelected: (selected) => set({ selected: selected }),
}))
