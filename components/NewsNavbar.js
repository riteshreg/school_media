import Linkify from "react-linkify";

export default function NewsNavbar(){

    return(
        <div className="h-8 flex justify-center content-center rounded-md w-full bg-black">
            <div className="text-white">
             <Linkify>
             <h2 className="text-lg">Report your bug on <span className="text-blue-300">https://t.ly/aaXo</span></h2>
             </Linkify>  
            </div>
        </div>
    )
}