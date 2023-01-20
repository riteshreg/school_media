export default function Card({children}){
    return(
        <div className="rounded overflow-hidden shadow-lg bg-white">
            {children}
        </div>
    )
}