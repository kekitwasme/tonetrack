import Link from "next/link"
import { signIn, signOut, useSession } from "next-auth/react"

export default () => {
    const { status, update: updateSession } = useSession()

    return (
        // navigation bar
        <nav className="flex">
            <Link href="/">home</Link>

            {/* user actions div */}
            <div className="fixed right-5 flex space-x-5">
                {status === "authenticated" ? (
                    <>
                        {/* redirect to app */}
                        <Link href={"/app"}>Try out the app!</Link>

                        <Link href={"/sign-Up"}>Sign Up Now!</Link>

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
