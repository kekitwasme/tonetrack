import { getCollection } from "@lib/mongodb"
import { NextResponse } from "next/server"

const USER_COLLECTION = "data"

const getUser = async (email) => {
    return await getCollection(USER_COLLECTION)
        .then((collection) => collection.findOne({ email: email }, { projection: { password: 0, _id: 0 } }))
        .then((user) => NextResponse.json({ data: user }))
        .catch((error) => NextResponse.json({ message: error }, { status: 500 }))
}

const updateUser = async ({ email, data }, options = {}) => {
    return await getCollection(USER_COLLECTION)
        .then((collection) => collection.updateOne({ email: email }, { $set: data }, options))
        .then((response) =>
            response && response.acknowledged ? NextResponse.json({ data: response }) : NextResponse.json({ message: "unknown database error" }, { status: 500 })
        )
        .catch((error) => NextResponse.json({ error: error }, { status: 500 }))
}

const createUser = async (user) => {
    const existingUser = await getUser(user.email)

    if (existingUser) return NextResponse.json({ message: "user already exists" }, { status: 400 })

    return await getCollection(USER_COLLECTION)
        .then((collection) => collection.insertOne(user))
        .then((response) => {
            if (response && response.acknowledged) return NextResponse.json(response)
            return NextResponse.json({ message: "unknown database error" }, { status: 500 })
        })
        .catch((error) => {
            throw new Error(error)
        })
}

export const GET = async (req) => {
    const email = await req.nextUrl.searchParams.get("email")
    return await getUser(email)
}

export const POST = async (req) => {
    const data = await req.json()

    return await createUser(data)
}

export const PUT = async (req) => {
    const data = await req.json()

    return await updateUser(data)
}
