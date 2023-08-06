"use client"

import "./styles.css"

import Header from "@components/header"
import Footer from "@components/footer"

import { SessionProvider } from "next-auth/react"

export default ({ children, session }) => {
    return (
        <html lang="en">
            <SessionProvider session={session}>
                <body>
                    <Header />

                    {children}

                    <Footer />
                </body>
            </SessionProvider>
        </html>
    )
}
