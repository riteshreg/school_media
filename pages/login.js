import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useRouter } from "next/router";
import { useState } from "react";


const style = "px-5 py-2 border border-gray-300 rounded-md outline-green-300"

export default function LoginPage(){

    const supabase = useSupabaseClient();
    const router = useRouter()
    const [loginUser, setLoginUser] = useState({
        email:"",
        password:""
    })
    
    const handleChange = (event) =>{
            setLoginUser(prev=>({
                ...prev,
                [event.target.name] : event.target.value
            }))
    }
//    async function handleGoogleLogin(){
//     await supabase.auth.signInWithOAuth({
//         provider: 'google',
//       })
//     }

const handleLogin  = async() =>{
    const { data, error } = await supabase.auth.signInWithPassword(loginUser)
    console.log(data)
    if(data.session.access_token){
        router.push('/')
    }

}

    return(
        <div className="h-screen w-screen flex items-center justify-center">
            <div className="flex flex-col space-y-4">
                <input type="email" placeholder="email" className={style} name="email" onChange={handleChange} />
                <input type="email"  placeholder="password" className={style} name="password" onChange={handleChange} />
                <button className="bg-blue-300 px-2 py-2 rounded-md" onClick={handleLogin}>Login</button>
            </div>
            {/* <button onClick={handleGoogleLogin} className="bg-[#DB4437] px-5 py-2 rounded-md text-white">Sign In With Google</button> */}
        </div>
    )
}