import { create } from "zustand"

export default create((set) => ({
    menu: {},
    setMenu: (menu) => set({ menu: { ...menu } }),
}))
