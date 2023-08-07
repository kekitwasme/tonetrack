import { useState } from "react"
import useUserData from "@stores/useUserData"

const defaultRoutine = {}

export default () => {
    const [currentRoutine, setCurrentRoutine] = useState(defaultRoutine)
    const { email, data, setUserData } = useUserData()

    const handleInputChange = (event) => {
        const { name, value } = event.target

        const [parent, child] = name.split(":")

        setCurrentRoutine(child ? { ...currentRoutine, [parent]: { ...currentRoutine[parent], [child]: value } } : { ...currentRoutine, [name]: value })
    }

    const updateUserRoutines = async () => {
        const { nextID, items } = data.routines

        const routines = {
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
                "data.routines": routines,
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

        if (updated) setUserData({ data: { routines: routines } })
    }

    const Tasks = () => {
        return data.tasks.items.map(({ id, name }) => (
            <option key={id} value={id}>
                {name}
            </option>
        ))
    }

    if (!data) return null

    return (
        <form className="flex flex-col space-y-5 items-center" onChange={handleInputChange}>
            <label htmlFor="name">Routine Name</label>
            <input name="name" id="name" />

            <label htmlFor="type">Type</label>
            <select name="type" id="type"></select>

            <select name="tasks" id="tasks" multiple>
                <Tasks />
            </select>

            <label htmlFor="duration">Duration</label>
            <div className="flex flex-row" name="duration" id="duration">
                <input name="duration:value" />
                <input name="duration:unit" />
            </div>

            <label htmlFor="routine">Routine</label>
            <select name="routine" id="routine"></select>

            <button type="button" onClick={updateUserRoutines}>
                Create
            </button>
        </form>
    )
}
