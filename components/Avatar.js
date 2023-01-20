import Image from "next/image";
const  link="https://cdn.pixabay.com/photo/2016/08/20/05/38/avatar-1606916_960_720.png"
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