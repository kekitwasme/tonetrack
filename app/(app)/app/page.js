"use client"

import Card from "@components/app/itemCard"
import ExpandedCard from "@components/app/itemCardExpanded"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

import { useUser } from "@stores/dataStates"
import { useMenu, useExpandItemCard, useNavigationBar } from "@stores/visibilityStates"

export default () => {
    const { data: session, status } = useSession({ required: true })
    const { data: userData, set: setUserData } = useUser()
    const { expand: expandItemCard, set: setExpandItemCard } = useExpandItemCard()
    const { visible: menuOpen, selected: selectedMenuOption, set: setMenu } = useMenu()
    const { visible: showNavigationBar, selected: selectedView, set: setNavigationBar } = useNavigationBar()

    const [selectedItem, setSelectedItem] = useState()
    const [updating, setUpdating] = useState(false)

    useEffect(() => {
        const fetchUserData = async () => {
            const { data, message } = await fetch("/api/user?email=" + session.user.email).then((res) => res.json())
            setUserData(data)
        }

        status === "authenticated" && session && !userData && fetchUserData()
    })

    useEffect(() => {
        setNavigationBar({ show: !(menuOpen || expandItemCard) })
    }, [menuOpen, expandItemCard])

    const SearchBar = () => {
        return <input className="w-full mr-5 border-2 bg-transparent"></input>
    }

    const CreationButton = () => {
        return (
            <button
                onClick={() => {
                    setUpdating(false)
                    setExpandItemCard({ expand: true })
                }}
                className="mr-2 text-white border-white border-1 p-1"
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
            <>
                <div className="flex justify-between">
                    <SearchBar />
                    <CreationButton />
                </div>

                {userData.tasks.items.map((task) => {
                    return (
                        <Card
                            key={task.id}
                            onClick={() => {
                                setUpdating(true)
                                setSelectedItem(task)
                                setExpandItemCard({ expand: true })
                            }}
                        >
                            <div className="flex space-x-5 h-full justify-between">
                                <div className="flex flex-col w-4/5">
                                    <h1>{task.name}</h1>
                                </div>

                                <button className="self-start">+</button>
                            </div>
                        </Card>
                    )
                })}
            </>
        )
    }

    const Routines = () => {
        return (
            <>
                <div className="flex justify-between">
                    <SearchBar />
                    <CreationButton />
                </div>

                {userData.routines.items.map((routine) => {
                    return (
                        <Card
                            key={routine.id}
                            onClick={() => {
                                setUpdating(true)
                                setSelectedItem(routine)
                                setExpandItemCard({ expand: true })
                            }}
                        >
                            <div className="flex space-x-5 h-full justify-between">
                                <div className="flex flex-col w-4/5">
                                    <h1>{routine.name}</h1>
                                </div>

                                <button className="self-start">+</button>
                            </div>
                        </Card>
                    )
                })}
            </>
        )
    }

    const getLayout = () => {
        switch (selectedView) {
            case "todos":
                return <Todos />
            case "tasks":
                return <Tasks />
            case "routines":
                return <Routines />
        }
        return
    }

    if (!userData) return

    return (
        <div className="grow">
            <div className="flex flex-col justify-start space-y-10 h-full p-6">{userData && getLayout()}</div>
            {expandItemCard && <ExpandedCard selectedItem={selectedItem} updating={updating} />}
        </div>
    )
}
