"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import useUserData from "@stores/useUserData"

const Welcome = () => {
    return (
        <div className="block text-center">
            This is the home page
            <br />
            Say something nice to new users
        </div>
    )
}

export default () => {
    const { data: session, status, update: updateSession } = useSession({ required: true })
    const { userData, setUserData } = useUserData()

    useEffect(() => {
        const fetchUserData = async () => {
            const { data, message } = await fetch("/api/user?email=" + session.user.email).then((res) => res.json())
            setUserData(data)
        }

        session && !userData && fetchUserData()
    })

    return (
        <div>
            <Welcome />
        </div>
    )
}
