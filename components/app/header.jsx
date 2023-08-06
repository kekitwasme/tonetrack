import useMenu from "@stores/useMenu"

export default () => {
    const { open, setOpen } = useMenu()

    return (
        <div>
            <button onClick={() => setOpen(!open)}>Menu</button>
        </div>
    )
}
