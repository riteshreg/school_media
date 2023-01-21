import { UserContext } from "@/UserContext";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { useSupabaseClient } from "@supabase/auth-helpers-react/dist";
import Image from "next/image";
import { useContext, useState } from "react";
import { MutatingDots } from "react-loader-spinner";
import Avatar from "../Avatar";
import Card from "../Card";

export default function CreatePost() {
  const supabase = useSupabaseClient();

  const [userPostText, setUserPostText] = useState();
  const { loginUserData } = useContext(UserContext);
  const [images, setImage] = useState([]);
  const [showLoader, setShowLoader] = useState(false);

  const handleCreatePost = () => {
    supabase
      .from("posts")
      .insert({
        content: userPostText,
        author: loginUserData?.id,
        images: images,
      })
      .then((response) => {
        setImage(false)
        setUserPostText(false)
      });
  };

  const handleFileChange = async (event) => {
    setShowLoader(true);
    const files = event.target.files;
    for (const file of files) {
      const filename = new Date().getTime() + file.name;
      const response = await supabase.storage
        .from("images")
        .upload(filename, file);
      if (response.data) {
        const imageUrl = `https://ypticbcztdwpynckjwag.supabase.co/storage/v1/object/public/images/${response.data.path}`;
        setImage((prevImage) => [...prevImage, imageUrl]);
      }
    }
    setShowLoader(false);
  };

  return (
    <Card>
      <div className="flex px-4 mt-2 ml-0 py-1 gap-4 items-center ">
        <Avatar />
        <div className="relative w-[70%]">
          <div className="">
            <textarea
              className="w-full pl-2 "
              onChange={(event) => setUserPostText(event.target.value)}
              placeholder="send message to student"
            />
          </div>
          <label className="absolute right-0 flex mb-2 items-center top-0 bottom-0 ">
            <input
              onChange={handleFileChange}
              type="file"
              multiple
              className="hidden"
            />
            <PhotoIcon className="h-8 text-gray-400 ml-2" />
          </label>
        </div>
        <button
          onClick={handleCreatePost}
          className="py-2 px-4 bg-blue-400 text-white rounded-md"
        >
          Post
        </button>
      </div>
      { 
        showLoader&&
        <div className="flex  justify-center">
        <MutatingDots
        height="100"
        width="100"
        color="#635f75"
        secondaryColor= '#4fa94d'
        radius='12.5'
        ariaLabel="mutating-dots-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
       />
       </div>
      }
      {images.length > 0 && (
        <div
          className={`  ${images.length >= 3 && "grid grid-cols-3"} ${
            images.length < 3 && "flex justify-evenly"
          }`}
        >
          {images.map((image) => (
            <Image
              key={image}
              src={image}
              alt="image"
              className="h-44 w-auto rounded-md p-1"
              height={720}
              width={720}
            />
          ))}
        </div>
      )}
    </Card>
  );
}
