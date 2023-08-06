"use client"

import { signIn } from "next-auth/react"
import { useEffect, useRef, useState } from "react"

export default () => {
    const [name, setName] = useState({ message: "name must be at least 3 characters long" })
    const [email, setEmail] = useState({ message: "invalid email" })
    const [password, setPassword] = useState({ message: "password must contain at least 8 characters, 1 letter and 1 number" })

    const [response, setResponse] = useState()

    const handleInputChange = (event) => {
        const { name, value } = event.target

        switch (name) {
            case "name":
                setName((data) => ({ ...data, value: value, invalid: value ? value.length < 3 : null }))
                break

            case "email":
                const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/

                setEmail((data) => {
                    return {
                        ...data,
                        value: value,
                        invalid: value ? !emailRegex.test(value) : null,
                    }
                })
                break

            case "password":
                const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/

                setPassword((data) => {
                    return {
                        ...data,
                        value: value,
                        invalid: value ? !passwordRegex.test(value) : null,
                    }
                })
                break
            default:
                break
        }

        setCurrentTask({ ...currentTask, [key]: value })
    }

    const maybeGetMessage = ({ invalid, message }) => {
        if (invalid) {
            return <p className="text-red-500">{message}</p>
        }
    }

    const submitForm = async () => {
        const response = await fetch("/api/user", {
            method: "POST",
            cache: "no-store",
            body: JSON.stringify({ name: name.value, email: email.value, password: password.value }),
        })
            .then(async (response) => {
                if (response.ok) return response.json()
                throw new Error("response not ok")
            })
            .then((jsonResponse) => {
                if (jsonResponse && jsonResponse.acknowledged) {
                    signIn("credentials", { login: email, password: password, callbackUrl: "/" })
                }
                return jsonResponse
            })
            .catch((error) => {
                // handle error
                console.log(error)
            })

        // setResponse(response)
    }

    const valid = [name, email, password].every(({ value, invalid }) => invalid !== true && value !== undefined)

    return (
        <form className="flex flex-col space-y-5 items-center" onChange={handleInputChange}>
            <h1>Create user account</h1>
            {maybeGetMessage(name)}
            <input type="text" name="name" required placeholder="name" />

            {maybeGetMessage(email)}
            <input type="email" name="email" placeholder="email" />

            {maybeGetMessage(password)}
            <input type="password" name="password" placeholder="password" />

            <text
                onClick={
                    valid
                        ? submitForm
                        : () => {
                              console.log(valid, name, email, password)
                          }
                }
                className={valid ? "bg-blue-500" : "bg-red-500"}
            >
                sign up
            </text>
        </form>
    )
}
