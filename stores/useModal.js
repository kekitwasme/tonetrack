import { create } from "zustand"

export default create((set) => ({
    open: true,
    children: null,
    setModal: (data) => set({ ...data }),
}))
