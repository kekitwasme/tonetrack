const SingleItem = (data) => {
    const getSingleTask = () => {
        return <></>
    }

    const getSingleRoutine = () => {
        return <></>
    }

    switch (data.type) {
        case "task":
            return getSingleTask()
        case "routine":
            return getSingleRoutine()
        default:
            return
    }
}

export default ({ data }) => {
    console.log("hi")
    return <div></div>
}
