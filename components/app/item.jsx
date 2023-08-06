const Item = (data) => {
    const getTodo = () => {
        return <></>
    }

    const getRoutine = () => {
        return <></>
    }

    const getTask = () => {
        return <></>
    }

    switch (data.type) {
        case "todo":
            return getTodo()
        case "routine":
            return getRoutine()
        case "task":
            return getTask()
    }
}

export default ({ data }) => {
    return (
        <div className="flex flex-col items-center justify-center">
            <Item />
        </div>
    )
}
