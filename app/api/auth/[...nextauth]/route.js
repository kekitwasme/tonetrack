import NextAuth from "next-auth/next"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { getDB } from "@lib/mongodb"

const config = {
    providers: [
        Credentials({
            name: "your ToneTrack account",
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                },
                password: {
                    label: "Password",
                    type: "password",
                },
            },
            async authorize(credentials, req) {
                return await getDB().then(async (db) => {
                    const user = await db.collection("data").findOne({
                        email: credentials.email,
                        password: credentials.password,
                    })

                    return user ? user : null
                })
            },
        }),
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (account.provider !== "credentials") {
                await getDB()
                    .then(async (db) => {
                        const filter = { email: user.email.toLowerCase() }
                        const update = { $set: { password: user.password } }
                        const option = { upsert: true }

                        return await db.collection("data").updateOne(filter, update, option)
                    })
                    .catch((error) => {
                        throw new Error(error)
                    })
            }

            return true
        },
        async session({ session }) {
            return session
        },
        async redirect({ url }) {
            return url
        },
    },
}

const handler = NextAuth(config)

export { handler as GET, handler as POST }
