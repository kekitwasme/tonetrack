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
                <body className="p-5">
                    {/* <span className="bg-gradient-to-br from-indigo-900 via-transparent to-transparent to-95% h-1/4 w-1/2"></span> */}

                    <Header />
                    {children}
                    <Footer />
                    {open && <Modal />}
                    {/* <span className="h-5/6 w-full bg-gradient-to-tl from-violet-400 from-5% via-transparent to-black absolute bottom-0 right-0"></span> */}
                </body>
            </SessionProvider>
        </html>
    )
}
