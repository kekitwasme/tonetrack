"use client"
import Image from "next/image"
import Link from "next/link"

import emailIcon from "@assets/email.svg"
import passwordIcon from "@assets/password.svg"
import facebookIcon from "@assets/facebookIcon.svg"
import googleIcon from "@assets/googleIcon.svg"
import appleIcon from "@assets/appleIcon.svg"
import logoIcon from "@assets/logo.svg"

import { signIn } from "next-auth/react"
import { useState } from "react"

export default () => {
    const [user, setUser] = useState({ email: "", password: "" })

    const handleInputChange = (event) => {
        const { name, value } = event.target
        setUser((user) => ({ ...user, [name]: value }))
    }

    return (
        <div className="h-fit flex flex-col space-y-7 items-center" onChange={handleInputChange}>
            <Link href="/">
                <Image src={logoIcon} alt="logo icon" />
            </Link>
            <h1 className="text-3xl text-white font-bold">LOGIN</h1>

            <div className="flex flex-col place-content-center">
                <label htmlFor="email">Email</label>
                <div className="w-25 h-11 flex flex-row justify-between space-x-0  bg-white px-5 ">
                    <Image src={emailIcon} alt="email icon" />
                    <input type="email" name="email" id="email" placeholder="Email" className="grow text-lg focus:outline-none px-5" />
                </div>

                <label htmlFor="password">Password</label>
                <div className="w-25 h-11 flex flex-row justify-between space-x-0  bg-white px-5">
                    <Image src={passwordIcon} alt="password icon" />
                    <input type="password" name="password" id="password" placeholder="Password" className="grow text-lg focus:outline-none px-5" />
                </div>

                <button
                    className="my-10 text-gray-900 font-bold text-xl bg-gradient-to-r from-cyan-100 from-30% via-violet-100 via-70% to-violet-300 to-90% rounded-[10px] flex justify-center px-20 py-2 "
                    onClick={() => signIn("credentials", { email: user.email, password: user.password, callbackUrl: "/" })}
                >
                    Login
                </button>

                <div className="py-1"></div>
                <div className="inline-flex items-center justify-bwteen w-full">
                    <div className="grow w-20 h-0.5 my-8 bg-gray-400 border-0 rounded"></div>
                    <h2 className="mx-5 text-white font-semiboldbold">OR</h2>
                    <div className="grow w-20 h-0.5 my-8 bg-gray-400 border-0 rounded"></div>
                </div>
            </div>

            <div className="flex justify-bwteen place-content-center space-x-7">
                <Image src={googleIcon} alt="password icon" onClick={() => signIn("google")} />
                <Image src={facebookIcon} alt="password icon" />
                <Image src={appleIcon} alt="password icon" />
            </div>

            <Link href={"/forgot-password"} className="text-white">
                Forgot password?
            </Link>

            <div className="flex flex-row space-x-2 items-center">
                <span className="text-white">Don't have an account?</span>
                <Link href={"sign-up"} className="text-white font-bold font underline">
                    Signup
                </Link>
            </div>
        </div>
    )
}
