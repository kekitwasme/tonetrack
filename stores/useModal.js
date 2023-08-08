import { create } from "zustand"

export default create((set) => ({
    open: false,
    children: null,
    setModal: (data) => set({ ...data }),
}))
