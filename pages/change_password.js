import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { MutatingDots } from "react-loader-spinner";


function ChangePassword() {
  const supabase = useSupabaseClient();
  const router = useRouter();
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)
  const [progress, setProgress] = useState(false)

  const [loginUser, setLoginUser] = useState({
    email: "",
    password: "",
    new_password: "",
  });

  const handleChange = (event) => {
    setError(false)
    setSuccess(false)
    setLoginUser((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleLogin = async () => {
    setProgress(true)
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginUser.email,
      password: loginUser.password,
    });
   console.log(error)
    if(error){setError(true);setProgress(false)}
    
    if (data.session?.access_token) {
      supabase.auth
        .updateUser({
          email: loginUser.email,
          password: loginUser.new_password,
        })
        .then((response) => {
            if(!response?.error){
                setSuccess(true)
                setProgress(false)
            }
        });
    }
  };

  
const style =
`px-1 w-64 py-2 border  ${!error&&'border-gray-300' ||  error && 'border-red-600 border-2'} rounded-md outline-green-300`;

  return (
    <div>
      <div className="h-screen w-screen bg-gray-100 flex flex-col items-center justify-center">
        <div className="flex  flex-col justify-center  content-center itemc space-y-4">
          <input
            type="email"
            placeholder="email"
            className={style}
            name="email"
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="password"
            className={style}
            name="password"
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="new password"
            className={style}
            name="new_password"
            onChange={handleChange}
          />
          
          <button
            className="bg-blue-300 px-2 py-2 rounded-md"
            onClick={handleLogin}
          >
            Change Password
          </button>
        </div>
        <button
          onClick={() => router.push("/login")}
          className="text-blue-900 mt-3"
        >
          Login
        </button>
       {success && <div className="w-96 mt-6 bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3" role="alert">
  <p className="font-bold">Password has been Changed</p>
  <p className="text-sm">Please click on login to continue</p>
</div>}
{progress&&<MutatingDots
        height="100"
        width="100"
        color="#635f75"
        secondaryColor= '#4fa94d'
        radius='12.5'
        ariaLabel="mutating-dots-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
       />}
      </div>
      
    </div>
  );
}

export default ChangePassword;
