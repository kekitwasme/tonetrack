import { create } from "zustand"

export default create((set) => {
    return {
        setUserData: (data) => set({ ...data }),
    }
})
