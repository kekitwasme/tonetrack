import { useUser, useCurrentItem } from "@stores/dataStates"
import { useExpandItemCard, useNavigationBar } from "@stores/visibilityStates"

import { useState } from "react"

import Confirmation from "@components/app/confirmation"

const fields = {
    tasks: [
        {
            name: "name",
            type: "text",
            label: "Task Name",
        },
        {
            name: "type",
            type: "select",
            label: "Type",
        },
        {
            name: "duration",
            type: "object",
            label: "Duration",
            properties: [
                {
                    name: "value",
                    type: "number",
                    label: "Value",
                },
                {
                    name: "unit",
                    type: "select",
                    label: "Unit",
                },
            ],
        },
        {
            name: "routineID",
            type: "routines",
            label: "Routine",
        },
    ],
    routines: [
        {
            name: "name",
            type: "text",
            label: "Routine Name",
        },
        {
            name: "taskIDs",
            type: "tasks",
            label: "Tasks",
        },
    ],
}

export default () => {
    const { data: currentItem, setData: setCurrentItemData, resetData: resetCurrentItemData } = useCurrentItem()
    const { data: userData, email, addItem, updateItem } = useUser()
    const { selected: selectedView } = useNavigationBar()
    const { set: setExpandItemCard, expand: expandItemCard } = useExpandItemCard()

    const [result, setResult] = useState()

    const getFields = () => {
        return fields[selectedView].map((field) => {
            switch (field.type) {
                case "tasks":
                    return <></>
                case "routines":
                    return <></>
                case "object":
                    return <></>
            }
        })
    }

    const handleInputChange = ({ target: { name, value } }) => {
        const [parent, child] = name.split(":")

        setCurrentItemData(child ? { [parent]: { ...currentItem[parent], [child]: value } } : { ...currentItem, [name]: value })
    }

    const handleAction = async () => {
        if (!updating) currentItem.id = userData[selectedView].nextID

        const payload = updating
            ? {
                  matchBy: { email: email },
                  operation: {
                      $set: {
                          [`data.${selectedView}.items`]: userData[selectedView].items.map((item) => {
                              if (item.id === currentItem.id) return currentItem
                              return item
                          }),
                      },
                  },
              }
            : {
                  matchBy: { email: email },
                  operation: {
                      $inc: { [`data.${selectedView}.nextID`]: 1 },
                      $push: { [`data.${selectedView}.items`]: currentItem },
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
                console.error(`Failed to update remote user ${selectedView}:`, error)
                setResult({ error: true, message: `Failed to update remote user ${selectedView}: ${error}` })
            })

        updating ? updated && updateItem(currentItem, selectedView) : updated && addItem(currentItem, selectedView)
    }

    const exit = (event) => {
        const { target, currentTarget } = event

        if (target === currentTarget) {
            setExpandItemCard({ expand: false })
            resetCurrentItemData()
        }
    }

    const Routines = () => {
        return userData.routines.items.map(({ id, name }) => (
            <option key={id} value={id}>
                {name}
            </option>
        ))
    }

    const getActionButton = () => {
        return (
            <button type="button" onClick={handleAction}>
                {updating ? "Update" : "Create"}
            </button>
        )
    }

    const getLayout = () => {
        return (
            <div className="flex flex-col space-y-5 items-center h-1/3 w-1/3 self-center bg-violet-100" onChange={handleInputChange}>
                {selectedView === "tasks" ? (
                    // task form fields
                    <>
                        <label htmlFor="name">Task Name</label>
                        <input name="name" id="name" defaultValue={currentItem?.name} />

                        <label htmlFor="type">Type</label>
                        <select name="type" id="type"></select>

                        <label htmlFor="duration">Duration</label>
                        <div className="flex flex-row" name="duration" id="duration">
                            <input name="duration:value" defaultValue={currentItem?.duration?.value} />
                            <input name="duration:unit" defaultValue={currentItem?.duration?.unit} />
                        </div>

                        <label htmlFor="routine">Routine</label>
                        <select name="routineID" id="routineID">
                            <Routines />
                        </select>
                    </>
                ) : (
                    // routine form fields
                    <>
                        <label htmlFor="name">Routine Name</label>
                        <input name="name" id="name" defaultValue={currentItem?.name} />

                        <label htmlFor="tasks">Tasks</label>
                        <select name="tasks" id="tasks">
                            {userData.tasks.items.map(({ id, name }) => (
                                <option name="taskIDs" key={id} value={id}>
                                    {name}
                                </option>
                            ))}
                        </select>
                    </>
                )}

                {getActionButton()}
            </div>
        )
    }

    const getConfirmation = () => {}

    const updating = currentItem !== null && currentItem !== undefined

    return (
        <div className="inset-0 backdrop-blur-md flex justify-center fixed z-10" onClick={exit}>
            {getLayout()}
            {result && getConfirmation()}
        </div>
    )
}
