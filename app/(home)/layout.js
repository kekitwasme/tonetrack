"use client"

import "./styles.css"

import Link from "next/link"

import { SessionProvider, useSession, signIn, signOut } from "next-auth/react"
import { Maven_Pro } from "next/font/google"

const MavenPro = Maven_Pro({
    subsets: ["latin"],
    display: "swap",
})

const NavigationBar = () => {
    const { status } = useSession()

    return (
        <nav className="flex text-white top-0 fixed pt-4 px-7">
            <Link href="/">home</Link>

            {/* user actions div */}
            <div className="fixed right-5 flex space-x-5">
                {status === "authenticated" ? (
                    <>
                        {/* redirect to app */}
                        <Link href={"/app"}>Try out the app!</Link>

                        <Link href={"/sign-up"}>Sign Up Now!</Link>

                        {/* log in button */}
                        <button onClick={signOut}>Sign Out</button>
                    </>
                ) : (
                    <button onClick={signIn}>Sign In</button>
                )}
            </div>
        </nav>
    )
}

const Footer = () => {
    return <footer className="bottom-0 fixed">front page footer</footer>
}

export default ({ children, session }) => {
    return (
        <html lang="en" className={MavenPro.className}>
            <SessionProvider session={session}>
                <body
                    className="flex flex-col justify-center h-screen"
                    style={{ background: "linear-gradient(150deg, #000 0%, #484176 0.01%, #000 20.83%, #484176 86.98%, #ECE9FF 100%)" }}
                >
                    <NavigationBar />
                    {children}
                    <Footer />
                </body>
            </SessionProvider>
        </html>
    )
}
