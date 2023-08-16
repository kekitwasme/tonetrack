"use client"
import Image from "next/image"
import { useUser } from "@stores/dataStates"
import { useExpandItemCard, useNavigationBar } from "@stores/visibilityStates"

import { useState } from "react"
import { createRoutineIcon, deleteRoutineIcon } from "@assets/icons"

import Confirmation from "@components/app/confirmation"

export default ({ selectedItem, updating }) => {
    const { set: setExpandItemCard, expand: expandItemCard } = useExpandItemCard()
    const { data: userData, email, set: setUserData } = useUser()
    const { selected: selectedView } = useNavigationBar()

    const [result, setResult] = useState()
    const [currentItem, setCurrentItem] = useState({ ...selectedItem })

    const handleInputChange = ({ target: { name, value } }) => {
        const [parent, child] = name.split(":")

        setCurrentItem(child ? { [parent]: { ...currentItem[parent], [child]: value } } : { ...currentItem, [name]: value })
    }

    const updateItem = (newItem, to) => {
        const data = { ...userData }

        newItem.id = data[to].nextID++

        data[to].items.push(newItem)

        return { data: data }
    }

    const addItem = (updatedItem, of) => {
        userData[of].items = userData[of].items.map((item) => (item.id === updatedItem.id ? updatedItem : item))
        return { data: userData }
    }

    const handleAction = async () => {
        if (updating) {
            // userData[selectedView].items.map((item) => (item.id === currentItem.id ? currentItem : item))
            updateItem(currentItem, selectedView)
        } else {
            // userData[selectedView].nextID++
            // userData[selectedView].items.push(currentItem)
            addItem(currentItem, selectedView)
        }

        return console.log(userData[selectedView].items)

        const payload = {
            matchBy: { email: email },
            operation: { $set: userData },
        }

        // updated will be truthy if the update was acknowledged, else falsy
        const ok = await fetch("api/user", {
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

        setResult({ ok: ok })
    }

    const exit = (event) => {
        const { target, currentTarget } = event

        if (target === currentTarget) {
            setExpandItemCard({ expand: false })
            resetCurrentItemData()
        }
    }

    const getRoutines = () => {
        const selectRoutine = (id) => setCurrentItem({ routineIDs: [...currentItem.routineIDs, id] })

        const deselectRoutine = (id) => setCurrentItem({ routineIDs: currentItem.routineIDs.filter((routineID) => routineID !== id) })

        const createRoutine = (id) => {
            currentItem.newRoutines.map((routine) => {
                addItem({ name: routine.name, taskIDs: [] }, "routines")
            })
        }

        return userData.routines.items.map(({ id, name }) => {
            const selected = currentItem.routineIDs.includes(id)

            return selected ? <div>{/* styling when routine is selected */}</div> : <div onClick={() => selectRoutine(id)}>{/* styling when not selected */}</div>
        })
    }

    const getTasks = () => {
        const selectTask = (id) => setCurrentItem({ taskIDs: [...currentItem.taskIDs, id] })

        const deselectTask = (id) => setCurrentItem({ taskIDs: currentItem.taskIDs.filter((taskID) => taskID !== id) })

        return userData.tasks.items.map(({ id, name }) => {
            const selected = currentItem.taskIDs.includes(id)

            return selected ? <div>{/* styling when routine is selected */}</div> : <div onClick={() => selectTask(id)}>{/* styling when not selected */}</div>
        })
    }

    const getActionButton = () => {
        return (
            <button
                className="fixed bottom-10  w-4/5 text-gray-900 font-bold text-xl bg-gradient-to-r from-cyan-100 from-30% via-violet-100 via-70% to-violet-300 to-90% rounded-[10px] flex justify-center px-20 py-2 "
                type="button"
                onClick={handleAction}
            >
                {updating ? "Update" : "Create"}
            </button>
        )
    }

    const getLayout = () => {
        return (
            <div className="inset-0 flex justify-center fixed z-10 bg-opacity-0 lg:backdrop-blur-md lg:bg-indigo-950 lg:bg-opacity-90 " onClick={exit}>
                <div
                    style={{
                        background: "linear-gradient(150deg, #000 0%, #484176 0.01%, #000 20.83%, #484176 86.98%, #ECE9FF 100%)",
                    }}
                    className="flex flex-col items-center self-center text-white w-screen h-screen lg:h-1/3 lg:w-1/3"
                    onChange={handleInputChange}
                >
                    {selectedView === "tasks" ? (
                        // task form fields
                        <>
                            <div className="flex flex-col space-y-7 w-4/5 mt-20">
                                <div className="flex flex-col space-y-2">
                                    <label htmlFor="name">Task Name</label>
                                    <input className="text-lg text-black focus:outline-none h-10" name="name" id="name" defaultValue={currentItem?.name} />
                                </div>

                                <div className="flex flex-col space-y-2">
                                    <label htmlFor="type">Type</label>
                                    <select className="text-lg focus:outline-none h-10" name="type" id="type"></select>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="duration">Duration</label>
                                    <div className="flex flex-row h-10 justify-between" name="duration" id="duration">
                                        <input name="duration:value" className="w-3/6  text-black" defaultValue={currentItem?.duration?.value} />

                                        <input name="duration:unit" className="w-2/5 text-black " defaultValue={currentItem?.duration?.unit} />
                                    </div>
                                </div>

                                <div className="flex flex-col space-y-2 ">
                                    <label htmlFor="routineIDs">Routines</label>

                                    <div className="text-lg focus:outline-none h-fit" name="routineIDs" id="routineIDs">
                                        {/* only need one parent div between ⬆ and ⬇ */}
                                        <div className="flex flex-col space-x-1  ">
                                            {/* use getRoutines from line 84 to render the below */}
                                            <div className="flex col-auto space-x-3 ">
                                                {/* styling for selected */}
                                                <div className="flex flex-row space-x-1 bg-violet-100 h-10 w-fit item-center px-1 py-0.5 text-base font-semibold rounded-[10px] ">
                                                    <span className="text-zinc-900  h-fit w-fit px-2 py-3">Upper Body</span>
                                                    <Image src={deleteRoutineIcon} />
                                                </div>

                                                {/* styling for not selected */}
                                                <div className="flex flex-row border-2 h-10 w-fit px-1 py-0.5 text-base font-semibold rounded-[10px] ">
                                                    <span className="text-white  h-fit w-fit px-2 py-3">Warm-up</span>
                                                </div>
                                            </div>

                                            {/* dont forget to add onClick */}
                                            <div className="flex flex-row space-x-1 mt-5 ">
                                                <Image src={createRoutineIcon} alt="add routine icon" />
                                                <button>Create New Routine</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
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
            </div>
        )
    }

    const getConfirmation = () => {
        return (
            <Confirmation>
                <h1>{result.ok ? "Success!" : result.message}</h1>
            </Confirmation>
        )
    }

    // if (currentItem?.id) setUpdating(true)

    return result ? getConfirmation() : getLayout()
}
