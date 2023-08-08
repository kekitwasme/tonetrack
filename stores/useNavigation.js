import { create } from "zustand"

export default create((set) => ({
    selected: "tasks",
    setSelected: (selected) => set({ selected: selected }),
}))
