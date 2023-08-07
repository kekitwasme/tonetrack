import useNavigation from "@stores/useNavigation"

export default () => {
    const { setSelected } = useNavigation()

    return (
        <nav className="flex flex-row justify-evenly space-x-5 fixed bottom-0 w-full">
            <button onClick={() => setSelected("todos")}>todo</button>
            <button onClick={() => setSelected("routines")}>routines</button>
            <button onClick={() => setSelected("tasks")}>tasks</button>
            <button onClick={() => setSelected("achievements")}>achievements</button>
        </nav>
    )
}
