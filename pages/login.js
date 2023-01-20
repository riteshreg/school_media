import { useSupabaseClient } from "@supabase/auth-helpers-react"

export default function LoginPage(){
    const supabase = useSupabaseClient();
    
   async function handleGoogleLogin(){
    await supabase.auth.signInWithOAuth({
        provider: 'google',
      })
    }

    return(
        <div className="h-screen w-screen flex items-center justify-center">
            <button onClick={handleGoogleLogin} className="bg-[#DB4437] px-5 py-2 rounded-md text-white">Sign In With Google</button>
        </div>
    )
}