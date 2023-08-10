"use client"

import "./styles.css"

import Header from "@components/header"
import Footer from "@components/footer"

import { SessionProvider } from "next-auth/react"
import { Maven_Pro } from "next/font/google"

const MavenPro = Maven_Pro({
    subsets: ["latin"],
    display: "swap",
})

export default ({ children, session }) => {
    return (
        <html lang="en" className={MavenPro.className}>
            <SessionProvider session={session}>
                <body
                    className="flex flex-col justify-center h-screen"
                    style={{ background: "linear-gradient(150deg, #000 0%, #484176 0.01%, #000 20.83%, #484176 86.98%, #ECE9FF 100%)" }}
                >
                    <Header />

                    {children}

                    <Footer />
                </body>
            </SessionProvider>
        </html>
    )
}
