import { useState } from "react"
import useUserData from "@stores/useUserData"

export default () => {
    const { email, data, addItem } = useUserData()
    const [currentTask, setCurrentTask] = useState({ id: data ? data.tasks.nextID : 0 })

    const handleInputChange = (event) => {
        const { name, value } = event.target

        const [parent, child] = name.split(":")

        setCurrentTask(child ? { ...currentTask, [parent]: { ...currentTask[parent], [child]: value } } : { ...currentTask, [name]: value })
    }

    const createTask = async () => {
        const payload = {
            matchBy: { email: email },
            operation: {
                $inc: { "data.tasks.nextID": 1 },
                $push: { "data.tasks.items": currentTask },
            },
        }

        // updated will be truthy if the update was acknowledged, else falsy
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

        if (updated) addItem(currentTask, "tasks")
    }

    const Routines = () => {
        return data.routines.items.map(({ id, name }) => (
            <option key={id} value={id}>
                {name}
            </option>
        ))
    }

    const Types = () => {}

    if (!data) return null

    console.log(data)

    return (
        <div className="flex flex-col space-y-5 items-center  h-1/3 w-1/3 self-center bg-violet-100" onChange={handleInputChange}>
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
            <select name="routineID" id="routineID">
                <Routines />
            </select>

            <button type="button" onClick={createTask}>
                Create
            </button>
        </div>
    )
}
