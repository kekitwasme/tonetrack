"use client"
const Welcome = () => {
    return (
        <div className="block text-center">
            This is the home page
            <br />
            Say something nice to new users
        </div>
    )
}
export default () => {
    return (
        <div className="flex flex-col h-full">
            <Welcome />
        </div>
    )
}
