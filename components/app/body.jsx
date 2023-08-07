import useNavigation from "@stores/useNavigation"
import useUserData from "@stores/useUserData"
import useModal from "@stores/useModal"

import NewTaskForm from "@components/app/newTaskForm"
import NewRoutineForm from "@components/app/newRoutineForm"

export default () => {
    const { setModal } = useModal()
    const { selected, setSelected } = useNavigation()
    const { data } = useUserData()

    const SearchBar = () => {
        return
    }

    const CreationButton = () => {
        return (
            <button
                onClick={() => {
                    setModal({ open: true, children: selected === "tasks" ? NewTaskForm : NewRoutineForm })
                }}
            >
                +
            </button>
        )
    }

    const Todos = () => {
        data.todos.items.map(() => {})

        return
    }

    const Tasks = () => {
        data.tasks.items.map(() => {})

        return
    }

    const Routines = (params) => {
        data.routines.items.map(() => {})

        return
    }

    const getLayout = () => {
        switch (selected) {
            case "todos":
                return <Todos />
            case "tasks":
                return <Tasks />
            case "routines":
                return <Routines />
        }
        return
    }

    return (
        <div>
            <CreationButton />
            {/* {getLayout()} */}
        </div>
    )
}
