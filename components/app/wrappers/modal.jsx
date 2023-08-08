import useModal from "@stores/useModal"

export default () => {
    const { children: Children, setModal } = useModal()

    return (
        <div
            className="h-full w-full inset-0 backdrop-blur-md flex justify-center fixed"
            onClick={({ target, currentTarget }) => {
                if (target === currentTarget) setModal({ open: false })
            }}
        >
            {Children && <Children />}
        </div>
    )
}
