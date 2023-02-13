import Link from "next/link";
import Linkify from "react-linkify";

export default function NewsNavbar(){

    return(
        <div className="h-8 flex justify-center content-center rounded-md w-full bg-black">
            <div className="text-white">
            <Link href={'https://forms.gle/ozb2waHAm3zmUsaU6'} target="_blank"><span className="text-blue-300 underline">Please report your bug</span></Link>
            </div>
        </div>
    )
}