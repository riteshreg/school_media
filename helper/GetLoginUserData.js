import { getSession } from "@/supabase";



  export const GetLoginUserData = async() =>{
     return await getSession()

  }