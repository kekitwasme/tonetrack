import { create } from "zustand"

export default create((set) => {
    return {
        setUserData: (data) => set({ ...data }),
        addItem: (item, to) =>
            set(({ data }) => {
                data[to].nextID++
                data[to].items.push(item)
                return { data: data }
            }),
    }
})
