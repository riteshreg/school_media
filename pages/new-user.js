import { useSupabaseClient } from "@supabase/auth-helpers-react";
import React, { useState } from "react";
import Select from "react-select";
import generator from 'generate-password-browser'
import AccountCreated from "@/components/Auth/AccountCreated";
import uuid from 'react-uuid';
import HomeLayout from "@/components/HomeLayout";


const style = "px-2 py-3 border rounded-md outline-blue-300"

var generatedPassword = generator.generate({
    length:8,
    numbers:true
 })


function NewUser() {
  const supabase = useSupabaseClient();

  const [toShow, setToShow] = useState(false)

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    status:"",
    password:""
  });

  const options = [
    { value: "9", label: "Class 9" },
    { value: "10", label: "Class 10" },
    { value: "11", label: "Class 11" },
    { value: "12", label: "Class 12" },
    { value: "developer", label: "Developer" },
    { value: "teacher", label: "Teacher" },
  ];

 

  const handleChage = (event) =>{

    setUserData(prev=> ({
        ...prev,
        password:generatedPassword,
        [event.target.name] : event.target.value
    }))

  }


  const handleNewUser = async () => {

    supabase.auth.signUp({
      email:userData.email,
      password:userData.password,
    }).then((response)=>{
      // console.log(response.data.user.id)
      if(response.data.user?.id){
        supabase.from('profiles').insert({
          id:response?.data.user.id,
          name:userData.name,
          email:userData.email,
          phone:userData.phone,
          status:userData.status,
        }).then((response)=>{
            setToShow(true)
          
        })
      }
    })
    

}




  return (
    <div className="min-h-screen  overflow-x-hidden space-y-7 ">
      <HomeLayout>
        <div className="ml-20 space-y-4">
        <h1 className=" mt-5 font-semibold text-xl ">जनता माध्यमिक विद्यालय गौरादह झापा</h1>
    <div className=" space-y-5 flex w-96 flex-col">
      <div className="flex flex-col  space-y-6">
        <input className={style} type="text" name="name" placeholder="full name" onChange={handleChage} />
        <input type="email" className={style} name="email" placeholder="email" onChange={handleChage} />
        <input type="tel" className={style} name="phone" placeholder="phone no" onChange={handleChage} />
        <Select id="selectbox" onChange={(e)=>setUserData({...userData,status:e.value})} instanceId="selectbox" options={options} />
      </div>
      <button onClick={handleNewUser} className="bg-blue-300 rounded-lg px-4 py-2">
        Create User
      </button>
    </div>
    {toShow && <AccountCreated {...userData}/>}
    </div>
      </HomeLayout>
    </div>
  );
}

export default NewUser;
