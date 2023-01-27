import { HeartIcon } from "@heroicons/react/24/outline";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Avatar from "../Avatar";
import Card from "../Card";
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';


export default function PostDispaly({id, content, images, created_at, profile,loginUser }) {

  const supabase = useSupabaseClient()

  const[likes, setLikes] = useState([])
  
  const router = useRouter()



  const handleLike  = () =>{
    if(!IAlreadyLiked){
      supabase.from("likes").insert({
          user_id:loginUser?.id,
          post_id:id
      }).then((resposne)=>{
          if(resposne.status == 201){
            GetAllLikes()
          }
      })
    }
  }

  useEffect(()=>{
    GetAllLikes()
  },[])

  function GetAllLikes(){
    supabase.from('likes').select().eq("post_id", id).then((res)=>setLikes(res.data))
  }

 const IAlreadyLiked =  !!likes.find(like=>like.user_id == loginUser.id)

  return (
    <div className="py-1">
      <Card className="py-10">
        <div className="px-4 flex items-center gap-3">
          <Avatar />
          <label className="mb-5 ">
            <span className="mr-2 font-semibold text-gray-700">
              {"Janata Mavi Gauradaha"}
            </span>
            Share a Post
          </label>
        </div>
        <div className="mx-2 my-1 p-1 text-md">
          <p className="text-left">{content}</p>
        </div>
        {images.length > 0 && (
          <div
            className={`${images.length === 2 && " md:flex"} ${
              images.length > 2 && "block md:grid md:grid-cols-2"
            }`}
          >
                <PhotoProvider>

            {images.map((image) => (
               <PhotoView key={image} src={image}>
              <Image
                alt="photo"
                height={720}
                className="p-2 rounded-sm overflow-hidden"
                width={720}
                src={image}
              />
              </PhotoView>
            ))}
                </PhotoProvider>

          </div>
        )}
        <div className="pl-2 py-4">
          <div  className="ml-4 flex gap-2 items-center">
           <HeartIcon onClick={handleLike}  className={`h-8 ${IAlreadyLiked && "fill-red-600"}`}/> 
            {likes.length}
          </div>
        </div>
      </Card>
    </div>
  );
}
