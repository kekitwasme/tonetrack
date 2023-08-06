import { useState } from "react"
import useUserData from "@stores/useUserData"

const defaultTask = {
    name: "",
    type: "",
    routine: "",
    duration: {
        value: 0,
        unit: "",
    },
    details: {},
}

export default () => {
    const [currentTask, setCurrentTask] = useState(defaultTask)
    const { email, data, updateUserData } = useUserData()

    const handleInputChange = (event) => {
        const { name, value } = event.target

        const [parent, child] = name.split(":")

        setCurrentTask(child ? { ...currentTask, [parent]: { ...currentTask[parent], [child]: value } } : { ...currentTask, [name]: value })
    }

    const updateUserTasks = async () => {
        const { nextID, items } = data.tasks

        const tasks = {
            nextID: nextID + 1,
            items: [
                ...items,
                {
                    ...currentRoutine,
                    id: nextID,
                },
            ],
        }

        const payload = {
            email: email,
            data: {
                "data.tasks": tasks,
            },
        }

        // result will be truthy if the update was acknowledged, else falsy
        const updated = await fetch("api/user", {
            method: "PUT",
            body: JSON.stringify(payload),
        })
            // jsonify the response
            .then((response) => response.json())
            // return if the update was acknowledged
            .then(({ data, message }) => data.acknowledged)
            .catch((error) => {
                console.error("Failed to update remote user tasks:", error)
            })

        if (updated) updateUserData({ data: { tasks: tasks } })
    }

    const Routines = () => {
        return data.tasks.map(({ id, name }) => (
            <option key={id} value={id}>
                {name}
            </option>
        ))
    }

    const Types = () => {}

    if (!userData) return null

    return (
        <form className="flex flex-col space-y-5 items-center" onChange={handleInputChange}>
            <label htmlFor="name">Task Name</label>
            <input name="name" id="name" />

            <label htmlFor="type">Type</label>
            <select name="type" id="type"></select>

            <label htmlFor="duration">Duration</label>
            <div className="flex flex-row" name="duration" id="duration">
                <input name="duration:value" />
                <input name="duration:unit" />
            </div>

            <label htmlFor="routine">Routine</label>
            <select name="routine" id="routine">
                <Routines />
            </select>

            <button type="button" onClick={updateUserTasks}>
                Create
            </button>
        </form>
    )
}
