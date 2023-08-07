import { create } from "zustand"

export default create((set) => {
    return {
        setUserData: (data) => set({ ...data }),
        addTask: (task) =>
            set((data) => {
                data.tasks.items.push(task)
                data.tasks.nextID++

                return data
            }),
        // addRoutine: (routine) =>
        //     set((userData) => {
        //         userData.routines.items.push(routine)
        //         userData.routines.nextID++
        //         return userData
        //     }),
        // addTodo: (todo) =>
        //     set((userData) => {
        //         userData.todos.items.push(todo)
        //         userData.todos.nextID++
        //         return userData
        //     }),
    }
})
