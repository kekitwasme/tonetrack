import { getUser, insertUser, updateUser } from "@lib/mongodb"
import { NextResponse } from "next/server"

export const GET = async (req) => {
    const email = await req.nextUrl.searchParams.get("email")

    return await getUser({ email: email }, { projection: { password: 0, _id: 0 } })
        .then((user) => NextResponse.json({ data: user }))
        .catch((error) => NextResponse.json({ message: error }, { status: 500 }))
}

export const POST = async (req) => {
    const data = await req.json()

    const existingUser = await getUser(data.email)

    if (existingUser) return NextResponse.json({ message: "user already exists" }, { status: 400 })

    return await insertUser(data)
        .then((response) =>
            response && response.acknowledged ? NextResponse.json({ data: response }) : NextResponse.json({ message: "unknown database error" }, { status: 500 })
        )
        .catch((error) => NextResponse.json({ error: error }, { status: 500 }))
}

export const PUT = async (req) => {
    const { email, data } = await req.json()

    return await updateUser({ email: email }, { $set: data })
        .then((response) =>
            response && response.acknowledged ? NextResponse.json({ data: response }) : NextResponse.json({ message: "unknown database error" }, { status: 500 })
        )
        .catch((error) => NextResponse.json({ error: error }, { status: 500 }))
}
