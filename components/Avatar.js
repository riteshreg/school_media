import Image from "next/image";
const  link="https://ypticbcztdwpynckjwag.supabase.co/storage/v1/object/public/images/305480223_576509657594875_840635747841878545_n.jpg"
export default function Avatar(){
    return(
            <Image 
            className="h-20 p-1 border w-20 rounded-full"
            src={link}
            height={720}
            width={720}
            alt="profile"
            />
        
    )
}