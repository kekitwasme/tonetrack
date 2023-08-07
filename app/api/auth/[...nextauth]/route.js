import NextAuth from "next-auth/next"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { getUser, insertUser } from "@lib/mongodb"

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
                const user = await getUser({
                    email: credentials.email,
                    password: credentials.password,
                })

                return user ? user : null
            },
        }),
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (account.provider === "credentials") return true

            const existingUser = await getUser({ email: user.email })

            if (existingUser) return true

            const defaultData = {
                items: [],
                nextID: 0,
            }

            return await insertUser({
                ...user,
                data: {
                    tasks: defaultData,
                    routines: defaultData,
                    todos: defaultData,
                },
            })
                .then((res) => res.acknowledged)
                .catch((error) => {
                    // handle the error
                    return false
                })
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
