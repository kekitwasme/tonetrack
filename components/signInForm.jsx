import { signIn } from "next-auth/react"
import { useState } from "react"

export default () => {
    const [user, setUser] = useState({ email: "", password: "" })

    const handleInputChange = ({ name, value }) => {
        setUser((user) => ({ ...user, [name]: value }))
    }

    return (
        <div className="flex flex-col space-y-5 sm:p-10 md:p-15 lg:p-20 bg-yellow-200 w-[70%] h-full self-center" onChange={handleInputChange}>
            {/* credential login container */}
            <div className="flex flex-col place-content-center">
                <label htmlFor="email">Email</label>
                <div className="flex p-2 space-x-2">
                    <input type="email" name="email" id="email" className="grow" />
                </div>

                <label htmlFor="password">Password</label>
                <div className="flex p-2 space-x-2">
                    <input type="password" name="password" id="password" className="grow" />
                    {/* show password icon */}
                    {/* show password text */}
                </div>

                <button onClick={() => signIn("credentials", { ...user, redirect: false })}>Sign in with credentials</button>
            </div>

            {/* seperator */}

            <div className="flex place-content-center">
                some icons here
                {/* icon 1 */}
                {/* icon 2 */}
                {/* icon 3 */}
            </div>
        </div>
    )
}
