import Image from "next/image";
const  link="https://ypticbcztdwpynckjwag.supabase.co/storage/v1/object/public/images/305480223_576509657594875_840635747841878545_n%20(2).jpg"
export default function Avatar(){
    return(
            <Image 
            className="p-1 border  rounded-full"
            src={link}
            height={65}
            width={65}
            alt="profile"
            />
        
    )
}