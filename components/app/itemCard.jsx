export default ({ children, onClick }) => {
    return (
        <div className="bg-gradient-to-l from-cyan-100 from-35% to-slate-100 rounded-xl h-[16%] px-4" onClick={onClick}>
            {children}
        </div>
    )
}
