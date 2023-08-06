import { create } from "zustand"

export default create((set) => ({
    open: false,
    selected: null,
    setOpen: (open) => set({ open: open }),
    setSelected: (selected) => set({ selected: selected }),
}))
