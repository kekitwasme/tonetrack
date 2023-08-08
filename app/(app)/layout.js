"use client"

import "./styles.css"

import Header from "@components/app/header"
import Footer from "@components/app/footer"

import useModal from "@stores/useModal"

import { SessionProvider } from "next-auth/react"
import Modal from "@components/app/wrappers/modal"

export default ({ children, session }) => {
    const { open } = useModal()

    return (
        <html lang="en">
            <SessionProvider session={session}>
                <body className="p-5 h-screen w-screen flex flex-col">
                    <Header />
                    {children}
                    <Footer />
                    {open && <Modal />}
                </body>
            </SessionProvider>
        </html>
    )
}
