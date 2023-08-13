"use client"

import "./styles.css"

import { SessionProvider } from "next-auth/react"

import { useMenu, useNavigationBar } from "@stores/visibilityStates"
import { Maven_Pro } from "next/font/google"

const MavenPro = Maven_Pro({
  subsets: ["latin"],
  display: "swap",
})

const Menu = () => {
  const { set } = useMenu()

  return (
    <div className="text-white fixed top-0">
      <button onClick={() => set({ open: true })}>Menu</button>
    </div>
  )
}

const NavigationBar = () => {
  const { show, set } = useNavigationBar()

  const setSelected = (selected) => {
    set({ selected: selected })
  }

  return show ? (
    <nav className="flex flex-row justify-evenly space-x-5 fixed bottom-0 w-full text-white">
      <button onClick={() => setSelected("todos")}>todo</button>
      <button onClick={() => setSelected("routines")}>routines</button>
      <button onClick={() => setSelected("tasks")}>tasks</button>
      <button onClick={() => setSelected("achievements")}>achievements</button>
    </nav>
  ) : null
}

export default ({ children, session }) => {
  return (
    <html lang="en" className={MavenPro.className}>
      <SessionProvider session={session}>
        <body
          className="p-5 h-screen w-screen flex flex-col"
          style={{
            background:
              "linear-gradient(150deg, #000 0%, #484176 0.01%, #000 20.83%, #484176 86.98%, #ECE9FF 100%)",
          }}
        >
          <Menu />
          {children}
          <NavigationBar />
        </body>
      </SessionProvider>
    </html>
  )
}
