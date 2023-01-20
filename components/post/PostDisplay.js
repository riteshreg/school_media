import { HandThumbUpIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Avatar from "../Avatar";
import Card from "../Card";


export default function PostDispaly({content,images,created_at,profile}) {

  return (
    <div className="pb-3">
      <Card>
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
          <p>
           {content}
          </p>
        </div>
      {images.length>0 && <div> 
        {
            images.map((image)=>
                <Image
                  key={image}
                  alt="photo"
                  height={720}
                  className="p-2 rounded-sm overflow-hidden"
                  width={720}
                  src={image}
                />
            )

        }
        </div>}
        <div className="pl-2 py-1">
          <div className="ml-4 flex gap-2 items-center">
            <HandThumbUpIcon className="h-8 text-gray-800" />
            {500}
          </div>
        </div>
      </Card>
    </div>
  );
}
