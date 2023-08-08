import { useState } from "react"
import useUserData from "@stores/useUserData"

const defaultRoutine = {}

export default () => {
    const [currentRoutine, setCurrentRoutine] = useState(defaultRoutine)
    const { email, data, addItem } = useUserData()

    const handleInputChange = (event) => {
        const { name, value } = event.target

        const [parent, child] = name.split(":")

        setCurrentRoutine(child ? { ...currentRoutine, [parent]: { ...currentRoutine[parent], [child]: value } } : { ...currentRoutine, [name]: value })
    }

    const updateUserRoutines = async () => {
        const payload = {
            matchBy: { email: email },
            operation: {
                $inc: { "data.routines.nextID": 1 },
                $push: { "data.routines.items": currentRoutine },
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
                console.error("Failed to update remote user routines:", error)
            })

        if (updated) addItem(currentRoutine, "routines")
    }

    if (!data) return null

    return (
        <div className="flex flex-col space-y-5 items-center h-1/3 w-1/3 self-center bg-violet-100" onChange={handleInputChange}>
            <label htmlFor="name">Routine Name</label>
            <input name="name" id="name" />

            <label htmlFor="type">Type</label>
            <select name="type" id="type"></select>

            <label htmlFor="tasks">Tasks</label>
            <select name="tasks" id="tasks">
                {data.tasks.items.map(({ id, name }) => (
                    <option name="taskIDs" key={id} value={id}>
                        {name}
                    </option>
                ))}
            </select>

            <button type="button" onClick={updateUserRoutines}>
                Create
            </button>
        </div>
    )
}
