"use client"
import Image from "next/image"
import { useUser } from "@stores/dataStates"
import { useExpandItemCard, useNavigationBar } from "@stores/visibilityStates"

import { useState } from "react"
import { createRoutineIcon, deleteRoutineIcon } from "@assets/icons"

import Confirmation from "@components/app/confirmation"

const getPreparedItem = (updating, data, of, userData) => {
    return data && updating ? { ...data } : { id: userData[of].nextID, ...(of === "routines" ? { taskIDs: [] } : {}) }
}

const getUpdatedUserData = (updating, newData, of, userData) => {
    let data = { ...userData }

    if (updating) {
        data[of].items = data[of].items.map((item) => (item.id === newData.id ? newData : item))
    } else {
        newData.id = data[of].nextID++
        data[of].items.push(newData)
    }

    return data
}

export default ({ selectedItem, updating }) => {
    const { set: setExpandItemCard, expand: expandItemCard } = useExpandItemCard()
    const { selected: selectedView } = useNavigationBar()
    const { set: setUser, data: userData, email } = useUser()

    const [result, setResult] = useState()
    const [currentItem, setCurrentItem] = useState(getPreparedItem(updating, selectedItem, selectedView, userData))
    const [localUserData, setLocalUserData] = useState(JSON.parse(JSON.stringify(userData)))
    const [creatingRoutine, setCreatingRoutine] = useState(false)

    const handleInputChange = ({ target: { name, value } }) => {
        const [parent, child] = name.split(":")

        if (child) {
            currentItem[parent] = { ...currentItem[parent], [child]: value }
        } else {
            currentItem[name] = value
        }

        setCurrentItem({ ...currentItem })
    }

    const handleAction = async () => {
        const data = getUpdatedUserData(updating, currentItem, selectedView, localUserData)

        const payload = {
            matchBy: { email: email },
            operation: { $set: { data: data } },
        }

        const ok = await fetch("api/user", {
            method: "PUT",
            body: JSON.stringify(payload),
        })
            // jsonify the response
            .then((response) => response.json())
            // return if the update was acknowledged
            .then(({ data, message }) => data?.acknowledged)
            .catch((error) => {
                console.error(`Failed to update remote user ${selectedView}:`, error)
                setResult({
                    error: true,
                    message: `Failed to update remote user ${selectedView}: ${error}`,
                })
            })

        setResult({ ok: ok })

        if (ok) {
            setUser({ data: data })
        }
    }

    const exit = (event) => {
        const { target, currentTarget } = event

        if (target === currentTarget) {
            setExpandItemCard({ expand: false })
        }
    }

    const getRoutinesSection = () => {
        const selectRoutine = (routineID) => {
            setLocalUserData((data) => {
                data.routines.items.find(({ id }) => id === routineID).taskIDs.push(currentItem.id)

                return { ...data }
            })
        }

        const unselectRoutine = (routineID) => {
            setLocalUserData((data) => {
                const routine = data.routines.items.find(({ id }) => id === routineID)
                routine.taskIDs = routine.taskIDs.filter((taskID) => taskID !== currentItem.id)

                if (!userData.routines.items.find(({ id }) => id === routineID)) {
                    data.routines.items = data.routines.items.filter(({ id }) => id !== routineID)
                }

                return { ...data }
            })
        }

        const createRoutine = (name) => {
            setLocalUserData((data) => getUpdatedUserData(false, { name: name, taskIDs: [currentItem.id] }, "routines", data))
        }

        const getRoutineElements = () => {
            let [a, b] = [[], []]

            localUserData.routines.items.forEach(({ id, name, taskIDs }) => {
                taskIDs?.includes(currentItem.id)
                    ? a.push(
                          <div
                              key={id}
                              className="flex flex-row item-center justify-center bg-violet-100 h-10 w-fit px-2 py-2 gap-x-1 text-base font-semibold rounded-[10px] "
                          >
                              <span className="text-zinc-900 w-fit whitespace-nowrap">{name}</span>
                              <Image src={deleteRoutineIcon} alt="delete routine icon" onClick={() => unselectRoutine(id)} />
                          </div>
                      )
                    : b.push(
                          <div
                              key={id}
                              className="place-content-center item-center border-2 h-10 w-fit px-2 py-1.5 text-base font-semibold rounded-[10px] "
                              onClick={() => selectRoutine(id)}
                          >
                              <span className="text-white  h-fit w-fit whitespace-nowrap">{name}</span>
                          </div>
                      )
            })

            return [...a, ...b]
        }

        return (
            <div className="flex flex-col space-y-2 ">
                <label htmlFor="routineIDs">Routines</label>

                <div className="flex flex-col text-lg focus:outline-none h-fit" name="routineIDs" id="routineIDs">
                    <div className="flex col-auto gap-y-5 gap-x-3 justify-start items-start h-fit flex-wrap">
                        {getRoutineElements()}
                        {creatingRoutine && (
                            <div
                                className="flex flex-row item-center justify-center bg-violet-100 h-10 w-fit px-2 py-2 gap-x-1 text-base font-semibold rounded-[10px] "
                                onBlur={() => setCreatingRoutine(false)}
                                onKeyDown={({ key, target }) => {
                                    switch (key) {
                                        case "Enter":
                                            createRoutine(target.value)
                                            setCreatingRoutine(false)
                                            break
                                        case "Escape":
                                            setCreatingRoutine(false)
                                            break
                                        default:
                                            break
                                    }
                                }}
                            >
                                <input autoFocus placeholder="Name" />
                                <Image src={deleteRoutineIcon} alt="delete routine icon" onClick={() => setCreatingRoutine(false)} />
                            </div>
                        )}
                    </div>
                    <div
                        className="flex flex-row space-x-1 mt-5"
                        onClick={() => {
                            setCreatingRoutine(true)
                        }}
                    >
                        <Image src={createRoutineIcon} alt="add routine icon" />
                        Create New Routine
                    </div>
                </div>
            </div>
        )
    }

    const getTasksSection = () => {
        const selectTask = (id) => setCurrentItem({ taskIDs: [...currentItem.taskIDs, id] })

        const deselectTask = (id) =>
            setCurrentItem({
                taskIDs: currentItem.taskIDs.filter((taskID) => taskID !== id),
            })

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

    const getConfirmation = () => {
        return (
            <Confirmation>
                <h1>{result.ok ? "Success!" : result.message}</h1>
            </Confirmation>
        )
    }

    const getLayout = () => (
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

                        {getRoutinesSection()}
                    </div>
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

    return result ? getConfirmation() : getLayout()
}
