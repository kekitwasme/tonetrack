import useMenu from "@stores/useMenu"

export default () => {
    const { menu, setMenu } = useMenu()

    return (
        <div>
            <button onClick={() => setMenu({ open: !menu.open })}>Menu</button>
        </div>
    )
}
