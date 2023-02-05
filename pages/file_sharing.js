import HomeLayout from "@/components/HomeLayout";
import { CloudArrowUpIcon, FolderPlusIcon } from "@heroicons/react/24/outline";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "@/UserContext";
import dynamic from "next/dynamic"
import { getMaterialFileIcon } from "file-extension-icon-js";
import { Rings } from "react-loader-spinner";
import { supabase } from "@/supabase";


 
  const ShowSharingList  = dynamic(()=> import('../components/filesharing/ShowSharingList'))


function FileSharing({AllFiles}) {
  const [allUploadedFilesFromSupabase, setAllUploadedFilesFromSupabase] =
    useState([]);
  const [allUploadedFilesFromLocal, setAllUploadedFilesFromLocal] = useState(
    []
  );
  const [AllFetchFiles, setAllFetchFiles] = useState([])

  const supabase = useSupabaseClient();

  const { loginUserId } = useContext(UserContext);

  useEffect(() => {
      setAllFetchFiles(AllFiles)
  }, []);

  function FetchAllFiles() {
    supabase
      .from("fileSharing")
      .select("id,created_at, file_url, profiles(name,status)")
      .then((respone) => {setAllFetchFiles(respone.data)});
  }


  const handleFileChange = (event) => {
    const files = event.target.files;
    for (const file of files) {
      setAllUploadedFilesFromLocal((prev) => [...prev, file.name]);
    }
    for (const file of files) {
      const path = new Date().getTime() + file.name;
      console.log(path);
      supabase.storage
        .from("filesharing")
        .upload(path, file)
        .then((response) => {
          const url = `https://ypticbcztdwpynckjwag.supabase.co/storage/v1/object/public/filesharing/${response.data.path}`;
          setAllUploadedFilesFromSupabase((prev) => [...prev, url]);
          console.log(response)
        });
    }
  };

  const handleFileUpload = () => {
    supabase
      .from("fileSharing")
      .insert({
        file_url: allUploadedFilesFromSupabase,
        author_id: loginUserId.id,
      })
      .then((respone) => {
          if(respone.status == 201){
            FetchAllFiles()
            setAllUploadedFilesFromLocal([])
            setAllUploadedFilesFromSupabase([])
          }
      });
  };
  

  return (
    <HomeLayout>
      <div>
        <div className="">
          <hr />
          <h1 className="text-xl text-center p-1">
            File Sharing And Project Submission
          </h1>
          <hr />
        </div>
        <div className="flex">
          <div>
            <label className="">
              <input
                className="hidden"
                type="file"
                multiple
                onChange={handleFileChange}
              />
              <div>
                <FolderPlusIcon className="h-8" />
              </div>
            </label>
            <label
              className={`${
                allUploadedFilesFromSupabase.length !== allUploadedFilesFromLocal.length  && "pointer-events-none"
              } ${allUploadedFilesFromLocal.length === 0 && "pointer-events-none"}`}
            >
              <div>
                <CloudArrowUpIcon
                  className={`${
                    allUploadedFilesFromSupabase.length !== allUploadedFilesFromLocal.length   && "text-gray-300"
                  } ${allUploadedFilesFromLocal.length === 0 && "text-gray-300"}`}
                  onClick={handleFileUpload}
                />
              </div>
            </label>
          </div>
          {allUploadedFilesFromLocal.length > 0 && (
            <div className="ml-10 p-1 flex space-x-4">
              {allUploadedFilesFromLocal.map((file) => (
                     <Image
                      key={file}
                     src={`${getMaterialFileIcon(file)}`}
                     alt="thumbnail"
                     height={66}
                     width="60"
                   />
              ))}
            </div>
          )}
          {allUploadedFilesFromLocal.length !== allUploadedFilesFromSupabase.length && <div className="ml-10 opacity-40 absolute ">
          <Rings/>
          </div>}
        </div>
        <hr />
        <div className=" grid grid-cols-5 gap-2 justify-between mt-5">
          {
            AllFetchFiles.map((file)=>
                <ShowSharingList {...file} key={file.id}/>
              )
          }
        </div>
      </div>
    </HomeLayout>
  );
}

export default FileSharing;


export  async function getServerSideProps(context){
 const data = await supabase
      .from("fileSharing")
      .select("id,created_at, file_url, profiles(name,status)")
     
  return{
    props:{
      AllFiles: data.data
    }
  }
}