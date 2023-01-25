import HomeLayout from '@/components/HomeLayout'
import GetProfile from '@/helper/GetProfile'
import { UserContext } from '@/UserContext'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'

function Messages() {
    const [redirect, setRedirect] = useState(true)
    const router = useRouter()
    const {loginUserProfile,setLoginUserProfile} = useContext(UserContext)
    
    const {id} = router.query
    const supabase = useSupabaseClient()


    useEffect(()=>{
      if(id){
          GetProfile(id,setLoginUserProfile)
      }
    },[id])
 


    useEffect(()=>{
        if(loginUserProfile?.status){
          router.push(`/messages/${id}/${loginUserProfile.status}`)
        }        
    })
    
  return (
    <div>
      <HomeLayout>
         <h1>Hey </h1>
      </HomeLayout>
    </div>
  )
}

export default Messages