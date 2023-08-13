import { useExpandItemCard } from "@stores/visibilityStates"
import { useCurrentItem } from "@stores/dataStates"

export default ({ children, item }) => {
    const { set: setCurrentItem } = useCurrentItem()
    const { set: setExpandItemCard } = useExpandItemCard()

    return (
        <div
            className="bg-gradient-to-l from-cyan-100 from-35% to-slate-100 rounded-xl h-[16%] px-4"
            onClick={() => {
                setCurrentItem({ data: item })
                setExpandItemCard({ expand: true })
            }}
        >
            {children}
        </div>
    )
}
