import HomeLayout from "@/components/HomeLayout";
import CreatePost from "@/components/post/CreatePost";
import PostDispaly from "@/components/post/PostDisplay";
import {GetLoginUserData} from "@/helper/GetLoginUserData";
import { useContext, useEffect, useState } from "react";
import LoginPage from "./login";
import { UserContext } from "@/UserContext";
import { useSupabaseClient } from "@supabase/auth-helpers-react/dist";

export default function Home() {

  const [loginUser, setLoginUser] = useState()
  const [AllPost, setAllPost] = useState([])

  const {setLoginUserData} = useContext(UserContext)


  const supabase = useSupabaseClient();

  useEffect(()=>{
    GetLoginUserData().then((response)=>{
      setLoginUserData(response.session?.user)
      setLoginUser(response.session?.user)
    })
  },[])

  useEffect(()=>{
    supabase.from('posts').select("id,author,content, images, created_at, profiles(avatar,name)").order("created_at",{ascending:false}).limit(20).then((response)=>{
      if(response.error){
        throw response.error
      } 
      if(response.data){
        setAllPost(response.data)
      }
    })
  },[supabase])

  if(!loginUser){
    return <LoginPage/>
  }

  return (
    <HomeLayout>
      <div className="space-y-4">
        <CreatePost />
        {AllPost.length>0 && AllPost?.map((item)=>
          <PostDispaly key={item.id} {...item}/>
        )            
        }
      </div>
    </HomeLayout>
  );
}
