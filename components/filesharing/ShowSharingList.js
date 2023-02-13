import { EllipsisHorizontalIcon, PlusIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import React, { useContext, useState } from "react";
import ClickOutHandler from "react-clickout-handler";
import Card from "../Card";
import useDownloader from "react-use-downloader";
import { supabase } from "@/supabase";
import { UserContext } from "@/UserContext";

function ShowSharingList({ file_name, id,file_url,profiles,subject }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [fileIconClass, setFileIconClass] = useState("");

  const {loginUserId} = useContext(UserContext)

  const { size, elapsed, percentage, download, cancel, error, isInProgress } =  useDownloader();

  function handleFileDownload() {
    if (file_url.length > 1) {
      // const splitName = file_url[0].split("/");
      // const filename = splitName[splitName.length - 1];
      for (const file of file_url) {
        download(file, file);
      }
    } else {
      download(file_url[0], filename);
    }
  }

  function handleFileDelete(){
    supabase.from("fileSharing").delete().eq('id', id).then(response=>{
      if(!response.error){
        supabase.storage.from("filesharing").remove([filename]).then((response)=>{
          console.log(response)
        })
      }
    })
  }

  const splitName = file_url[0]?.split("/");
  const filename = splitName?.[splitName?.length - 1];
  
  if(!filename) return

  return (
    <Card>
      <div className="">
        <div className={`py-4 px-3 relative `}>
          <div className=" w-40">
            <div className={`mt-1 flex items-center `}>
              <Image
                src={`https://upload.wikimedia.org/wikipedia/commons/0/01/Google_Docs_logo_%282014-2020%29.svg`}
                alt="img"
                height={40}
                width="40"
              />

              {file_url.length > 1 && (
                <div className="flex bg-blue-200 text-gray-900 rounded-full h-12 w-12 items-center">
                  {" "}
                  <PlusIcon className="h-6" />
                  <h1 className="text-2xl">{file_url.length - 1}</h1>
                </div>
              )}
              <div className="absolute right-0 top-0">
                {showDropdown && <EllipsisHorizontalIcon className="h-6" />}
                {!showDropdown && (
                  <EllipsisHorizontalIcon
                    className="h-6 "
                    onClick={() => setShowDropdown(true)}
                  />
                )}
                {showDropdown && (
                  <ClickOutHandler onClickOut={() => setShowDropdown(false)}>
                    <div className="modal absolute right-0">
                      <Card>
                        <div className="bg-slate-100 p-2 space-y-4">
                          <div className="bg-white">
                          <button onClick={handleFileDownload}>Download</button>
                          </div>
                         {profiles.id == loginUserId.id &&   <div className="bg-white">
                          <button onClick={handleFileDelete}>Delete</button>
                          </div>}
                        </div>
                      </Card>
                    </div>
                  </ClickOutHandler>
                )}
              </div>
            </div>
                <p className="text-xs mt-1 text-gray-400">@{profiles.name}</p>
               
          </div>
              <div>
              <p className="text-xs text-gray-400">{subject}</p>
              <p className="text-lg text-gray-700">{file_name}</p>
              </div>
              
        </div>
      </div>
    </Card>
  );
}

export default ShowSharingList;
