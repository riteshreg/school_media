import Head from "next/head";
import Avatar from "@/components/Avatar";
import Card from "@/components/Card";
import HomeLayout from "@/components/HomeLayout";
import CreatePost from "@/components/post/CreatePost";
import PostDispaly from "@/components/post/PostDisplay";
import {GetLoginUserData} from "@/helper/GetLoginUserData";
import { useEffect, useState } from "react";
import LoginPage from "./login";
import { UserContext } from "@/UserContext";
import { useSupabaseClient } from "@supabase/auth-helpers-react/dist";

export default function Home() {

  const [loginUser, setLoginUser] = useState()
  const [AllPost, setAllPost] = useState([])

  const supabase = useSupabaseClient();

  useEffect(()=>{
    GetLoginUserData().then((response)=>{
      setLoginUser(response.session?.user)
    })
  },[])

  useEffect(()=>{
    supabase.from('posts').select("id,author,content, images, created_at, profiles(avatar,name)").limit(20).then((response)=>{
      if(response.error){
        throw response.error
      } 
      if(response.data){
        setAllPost(response.data)
      }
    })
  },[])

  if(!loginUser){
    return <LoginPage/>
  }

  return (
    <HomeLayout>
      <UserContext.Provider value={loginUser}>
      <div className="space-y-4">
        <CreatePost />
        {AllPost.length>0 && AllPost?.map((item)=>
          <PostDispaly key={item.id} {...item}/>
        )            
        }
      </div>
      </UserContext.Provider>
    </HomeLayout>
  );
}
