"use client"
import Image from "next/image"
import { useUser, useCurrentItem } from "@stores/dataStates"
import { useExpandItemCard, useNavigationBar } from "@stores/visibilityStates"

import { useState } from "react"
import { createRoutineIcon, deleteRoutineIcon } from "@assets/icons"

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
  const {
    data: currentItem,
    setData: setCurrentItemData,
    resetData: resetCurrentItemData,
  } = useCurrentItem()
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

    setCurrentItemData(
      child
        ? { [parent]: { ...currentItem[parent], [child]: value } }
        : { ...currentItem, [name]: value }
    )
  }

  const handleAction = async () => {
    if (!updating) currentItem.id = userData[selectedView].nextID

    const payload = updating
      ? {
          matchBy: { email: email },
          operation: {
            $set: {
              [`data.${selectedView}.items`]: userData[selectedView].items.map(
                (item) => {
                  if (item.id === currentItem.id) return currentItem
                  return item
                }
              ),
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
        setResult({
          error: true,
          message: `Failed to update remote user ${selectedView}: ${error}`,
        })
      })

    updating
      ? updated && updateItem(currentItem, selectedView)
      : updated && addItem(currentItem, selectedView)
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
      <button key={id} value={id}>
        {name}
      </button>
    ))
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
      <div
        style={{
          background:
            "linear-gradient(150deg, #000 0%, #484176 0.01%, #000 20.83%, #484176 86.98%, #ECE9FF 100%)",
        }}
        className="flex flex-col items-center self-center text-white
        w-screen h-screen
        lg:h-1/3 w-1/3"
        onChange={handleInputChange}
      >
        {selectedView === "tasks" ? (
          // task form fields
          <>
            <div className="flex flex-col space-y-7 w-4/5 mt-20">
              <div className="flex flex-col space-y-2">
                <label htmlFor="name">Task Name</label>
                <input
                  className="text-lg focus:outline-none h-10"
                  name="name"
                  id="name"
                  defaultValue={currentItem?.name}
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label htmlFor="type">Type</label>
                <select
                  className="text-lg focus:outline-none h-10"
                  name="type"
                  id="type"
                ></select>
              </div>

              <div className="space-y-2">
                <label htmlFor="duration">Duration</label>
                <div
                  className="flex flex-row h-10 justify-between"
                  name="duration"
                  id="duration"
                >
                  <input
                    name="duration:value"
                    className="w-3/6"
                    defaultValue={currentItem?.duration?.value}
                  />

                  <input
                    name="duration:unit"
                    className="w-2/5 "
                    defaultValue={currentItem?.duration?.unit}
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-2 ">
                <label htmlFor="routine">Routine</label>
                <div
                  className="text-lg focus:outline-none h-fit"
                  name="routineID"
                  id="routineID"
                >
                  <Routines />

                  <div className="flex flex-col space-x-1  ">
                    <div className="flex col-auto space-x-3 ">
                      <div className="flex flex-row space-x-1 bg-violet-100 h-10 w-fit item-center px-1 py-0.5 text-base font-semibold rounded-[10px] ">
                        <span className="text-zinc-900  h-fit w-fit px-2 py-3">
                          Upper Body
                        </span>
                        <Image src={deleteRoutineIcon} />
                      </div>
                      <div className="flex flex-row space-x-1 bg-violet-100 h-10 w-fit px-1 py-0.5 text-base font-semibold rounded-[10px] ">
                        <span className="text-zinc-900  h-fit w-fit px-2 py-3">
                          Strength
                        </span>
                        <Image src={deleteRoutineIcon} />
                      </div>
                      <div className="flex flex-row border-2 h-10 w-fit px-1 py-0.5 text-base font-semibold rounded-[10px] ">
                        <span className="text-white  h-fit w-fit px-2 py-3">
                          Warm-up
                        </span>
                      </div>
                    </div>
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
    )
  }

  const getConfirmation = () => {}

  const updating = currentItem?.id || currentItem?.id === 0

  return (
    <div
      className="inset-0 flex justify-center fixed z-10 bg-opacity-0
     lg:backdrop-blur-md bg-indigo-950 bg-opacity-90 "
      onClick={exit}
    >
      {getLayout()}
      {result && getConfirmation()}
    </div>
  )
}
