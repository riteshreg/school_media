import { UserContext } from "@/UserContext";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { useSupabaseClient } from "@supabase/auth-helpers-react/dist";
import Image from "next/image";
import { useContext, useState } from "react";
import { Rings } from "react-loader-spinner";
import Avatar from "../Avatar";
import Card from "../Card";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import TextareaAutosize from "react-autosize-textarea";

export default function CreatePost({ FetchAllPost }) {
  const supabase = useSupabaseClient();

  const [userPostText, setUserPostText] = useState();
  const { loginUserId } = useContext(UserContext);
  const [preUploadedFiles, setPreUploadedFiles] = useState([]);
  const [images, setImage] = useState([]);
  const [showLoader, setShowLoader] = useState(false);

  const handleCreatePost = () => {
    supabase
      .from("posts")
      .insert({
        content: userPostText,
        author: loginUserId?.id,
        images: images,
      })
      .then((response) => {
        if (response.status == 201) {
          setImage(false);
          setUserPostText(false);
          FetchAllPost();
          setUserPostText("");
          setPreUploadedFiles([]);
        }
      });
  };

  const handleFileChange = async (event) => {
    setShowLoader(true);
    const files = event.target.files;
    for (const file of files) {
      setPreUploadedFiles((prev) => [...prev, URL.createObjectURL(file)]);
    }
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
      <div className="flex p-1  md:px-4 mt-2 ml-0 md:py-1 gap-1 md:gap-4 items-center ">
        <Avatar />
        <div className="relative selection:hidden group w-[70%]">
          <div className="">
            <TextareaAutosize
             rows={2}
              className="rounded-md w-full overflow-y-hidden pl-2 border outline-gray-200"
              placeholder="write something..."
              value={userPostText}
              onChange={(event) => { setUserPostText(event.target.value)}}
            />
          </div>
          <label className="absolute right-0 flex mb-2 items-center top-0 bottom-0 ">
            <input
              onChange={handleFileChange}
              type="file"
              multiple
              className="hidden"
            />
            <PhotoIcon className={`h-7 pr-1 md:h-8  text-gray-400 ml-2`} />
          </label>
        </div>
        <button
          onClick={handleCreatePost}
          className="py-2 px-4 bg-blue-400 text-white rounded-md"
        >
          Post
        </button>
      </div>

      {preUploadedFiles.length > 0 && (
        <PhotoProvider>
          <div className={`p-2 relative flex flex-wrap space-x-1`}>
            {preUploadedFiles.map((image) => (
              <PhotoView key={image} src={image}>
                <Image
                  src={image}
                  alt="image"
                  className={`h-24 cursor-pointer ${
                    preUploadedFiles.length !== images.length
                      ? `grayscale`
                      : "grayscale-0"
                  } w-auto overflow-hidden  rounded- p-1`}
                  height={480}
                  width={480}
                />
              </PhotoView>
            ))}
            {showLoader && (
              <div className=" absolute left-0  flex  right-0 z-50 justify-center">
                <Rings
                  height="80"
                  width="80"
                  color="#4fa94d"
                  radius="6"
                  wrapperStyle={{}}
                  wrapperClass=""
                  visible={true}
                  ariaLabel="rings-loading"
                />
              </div>
            )}
          </div>
        </PhotoProvider>
      )}
    </Card>
  );
}
