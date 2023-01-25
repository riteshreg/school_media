import { supabase } from '@/supabase'
import { UserContext } from '@/UserContext'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import React, { useContext } from 'react'

function GetProfile(id,setLoginUserProfile) {
    
    supabase.from("profiles").select().eq("id",id).then((response)=>setLoginUserProfile(response?.data?.[0]))
}

export default GetProfile