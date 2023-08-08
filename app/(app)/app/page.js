"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import useUserData from "@stores/useUserData"

import Body from "@components/app/body"

export default () => {
    const { data: session, status, update: updateSession } = useSession({ required: true })
    const { data, setUserData } = useUserData()

    useEffect(() => {
        const fetchUserData = async () => {
            const { data, message } = await fetch("/api/user?email=" + session.user.email).then((res) => res.json())
            setUserData(data)
        }

        status === "authenticated" && session && !data && fetchUserData()
    })

    return (
        <div className="grow">
            <Body />
        </div>
    )
}
