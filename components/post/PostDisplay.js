import { HeartIcon } from "@heroicons/react/24/outline";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Avatar from "../Avatar";
import Card from "../Card";
import { PhotoProvider, PhotoView } from "react-photo-view";
import Linkify from "react-linkify";
import ReactTimeAgo from "react-time-ago";

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
      setLikes((prev) => [...prev, "+1"]);
      supabase
        .from("likes")
        .insert({
          user_id: loginUser?.id,
          post_id: id,
        })
        .then((resposne) => {
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
            <ReactTimeAgo
              className="font-sans text-sm"
              date={new Date(created_at)}
              locale="en-US"
            />
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
            className={`relative ${images.length === 2 && " md:flex"} ${
              images.length > 2 && "block md:grid md:grid-cols-2"
            }`}
          >
            {
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
            }
           {/* { disabledLike
            && <div className="absolute top-1/2 left-1/2 text-white  transform -translate-x-1/2 -translate-y-1/2 ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-36 h-36"
              >
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
              </svg>
            </div>} */}
          </div>
        )}
        <div className=" py-1">
          <div className="ml-2 md:ml-4 flex gap-2 items-center">
            <HeartIcon
              onClick={handleLike}
              className={`${disabledLike && "pointer-events-none"} h-8  ${
                disabledLike && !IAlreadyLiked && "fill-red-600"
              }  ${IAlreadyLiked && "fill-red-600"}`}
            />
            {likes?.length}
          </div>
        </div>
      </Card>
    </div>
  );
}
