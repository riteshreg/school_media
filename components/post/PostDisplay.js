import { HeartIcon } from "@heroicons/react/24/outline";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Avatar from "../Avatar";
import Card from "../Card";
import { PhotoProvider, PhotoView } from "react-photo-view";
import Linkify from "react-linkify";
import ReactTimeAgo from 'react-time-ago'

export default function PostDispaly({
  id,
  content,
  images,
  created_at,
  profile,
  loginUser,
}) {
  const supabase = useSupabaseClient();

  const [likes, setLikes] = useState([]);
  const [disabledLike, setDisabledLike] = useState(false);

  const router = useRouter();

  const handleLike = () => {
    setDisabledLike(true);
    if (!IAlreadyLiked) {
      supabase
        .from("likes")
        .insert({
          user_id: loginUser?.id,
          post_id: id,
        })
        .then((resposne) => {
          if (resposne.status == 201) {
            GetAllLikes();
          }
        });
    }
  };

  useEffect(() => {
    GetAllLikes();
  }, []);

  function GetAllLikes() {
    supabase
      .from("likes")
      .select()
      .eq("post_id", id)
      .then((res) => setLikes(res.data));
  }

  const IAlreadyLiked = !!likes?.find((like) => like.user_id == loginUser.id);

  return (
    <div className="py-1 pl-1 md:py-2 px-1">
      <Card className="py-1">
        <div className="flex items-center gap-3">
          <div className="pt-1 pl-1">
            <Avatar />
          </div>
          <label className="mb-5 flex flex-col ">
            <span className="mr-2 font-semibold text-gray-700">
              {"Janata Mavi Official"}
            </span>
            <ReactTimeAgo className="font-sans text-sm" date={new Date(created_at)} locale="en-US"/>
          </label>
        </div>
        <div className="mx-1 pl-1 my-1 md:mx-2 md:my-2 md:px-1 text-md">
          <div className="all-initial">
          <Linkify>
          <p>{content}</p>
          </Linkify>
          </div>
        </div>
        {images?.length > 0 && (
          <div
            className={`${images.length === 2 && " md:flex"} ${
              images.length > 2 && "block md:grid md:grid-cols-2"
            }`}
          >
            <PhotoProvider>

            {
              images.map((image)=>
              <PhotoView key={image} src={image}>

              <Image
              alt="photo"
              height={720}
              className="p-2 cursor-pointer rounded-sm overflow-hidden"
              width={650}
              src={image}/>
              </PhotoView>
              )
            } 
              </PhotoProvider>
            {/* {
              <PhotoProvider>
                {images.map((image) => (
                  <PhotoView key={image} src={image}>
                    <Image
                      alt="photo"
                      height={700}
                      className="p-2 cursor-pointer rounded-sm overflow-hidden"
                      width={650}
                      src={image}
                    />
                  </PhotoView>
                ))}
              </PhotoProvider>
            } */}
          </div>
        )}
        <div className=" py-1">
          <div className="ml-2 md:ml-4 flex gap-2 items-center">
            <HeartIcon
              onClick={handleLike}
              className={`${disabledLike && "pointer-events-none"} h-8  ${
                IAlreadyLiked && "fill-red-600"
              }`}
            />
            {likes?.length}
          </div>
        </div>
      </Card>
    </div>
  );
}
