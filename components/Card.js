export default function Card({children}){
    return(
        <div className="rounded overflow-hidden shadow-xl border  bg-white">
            {children}
        </div>
    )
}