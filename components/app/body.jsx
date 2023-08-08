import useNavigation from "@stores/useNavigation"
import useUserData from "@stores/useUserData"
import useModal from "@stores/useModal"

import NewTaskForm from "@components/app/newTaskForm"
import NewRoutineForm from "@components/app/newRoutineForm"

import Card from "@components/app/wrappers/itemCard"

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
        return (
            <div className="flex flex-col h-4/5 p-5 rounded-sm border-2">
                {data.tasks.items.map((task) => {
                    return (
                        <Card key={task.id}>
                            <div className="flex space-x-5 h-full justify-between">
                                <div className="flex flex-col w-4/5">
                                    <h1>{task.name}</h1>
                                    <h1>{task.name}</h1>

                                    <h1>{task.name}</h1>
                                </div>

                                <div className="flex flex-col justify-between">
                                    <button>Edit</button>

                                    <CreationButton />
                                </div>
                            </div>
                        </Card>
                    )
                })}
            </div>
        )
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

    return <div className="h-full">{data && getLayout()}</div>
}
