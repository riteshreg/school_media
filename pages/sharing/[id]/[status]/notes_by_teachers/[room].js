import HomeLayout from "@/components/HomeLayout";
import {
  ArrowDownIcon,
  CloudArrowUpIcon,
  FolderPlusIcon,
} from "@heroicons/react/24/outline";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "@/UserContext";
import dynamic from "next/dynamic";
import {  Rings } from "react-loader-spinner";
import { supabase } from "@/supabase";
import { useRouter } from "next/router";
import GetTableFromStatus from "@/helper/GetTableFromStatus";
import GetProfile from "@/helper/GetProfile";
import Select from "react-select";
import { subjectName, SubjectTeacher } from "@/Subject";
import Loader from "@/helper/Loader";

const ShowSharingList = dynamic(() =>
  import("../../../../../components/filesharing/ShowSharingList")
);

export default function NotesByTeachers({ AllFiles }) {
  const [allUploadedFilesFromSupabase, setAllUploadedFilesFromSupabase] =
    useState([]);
  const [allUploadedFilesFromLocal, setAllUploadedFilesFromLocal] = useState(
    []
  );


  const [AllFetchFiles, setAllFetchFiles] = useState([]);
  const [loader, setLoader] = useState(false);
  const [fileName, setFileName] = useState("");

  const supabase = useSupabaseClient();

  const { loginUserId, loginUserProfile, setLoginUserProfile } =
    useContext(UserContext);

  const router = useRouter();
  const { status, id, room } = router.query;

  const [subjectTeacher, setSubjectTeacher] = useState('') //only usefull when teacher login
  useEffect(() => {
    if (status == "teacher") {
      setSubjectTeacher(SubjectTeacher[room].filter(
        (teacher) => teacher.id == id
      )[0]);
    }
  },[]);
  


  useEffect(() => {
    if (!loginUserProfile) {
      GetProfile(id, setLoginUserProfile);
    }
  }, []);

  useEffect(() => {
    if (AllFiles?.length > 0) {
      setAllFetchFiles(AllFiles);
    }
  }, []);

  function FetchAllFiles() {
    supabase
      .from(GetTableFromStatus(room)).
      select("id,created_at,subject, file_name, file_url, profiles(name,status)")
      .limit(10)
       .order("created_at",{ascending:false})
      .then((respone) => {
        setAllFetchFiles(respone.data);
      });
  }

  const handleFileChange = (event) => {
    const files = event.target.files;
    for (const file of files) {
      setAllUploadedFilesFromLocal((prev) => [...prev, file.name]);
    }
    for (const file of files) {
      const path = new Date().getTime() + file.name;
      supabase.storage
        .from("filesharing")
        .upload(path, file)
        .then((response) => {
          const url = `https://ypticbcztdwpynckjwag.supabase.co/storage/v1/object/public/filesharing/${response.data.path}`;
          setAllUploadedFilesFromSupabase((prev) => [...prev, url]);
          console.log(response);
        });
    }
  };


  const handleFileUpload = () => {
    supabase
      .from(GetTableFromStatus(room))
      .insert({
        file_url: allUploadedFilesFromSupabase,
        author_id: loginUserId.id,
        file_name: fileName,
        subject: subjectTeacher.subject,
      })
      .then((respone) => {
        if (respone.status == 201) {
          FetchAllFiles();
          setAllUploadedFilesFromLocal([]);
          setAllUploadedFilesFromSupabase([]);
        }
      });
  };

  function handleOptionsChange(e) {
    setLoader(true);
    setAllFetchFiles([]);
    if (e.value == "all") {
      setLoader(false);
      setAllFetchFiles(AllFiles);
    } else {
      supabase
        .from(GetTableFromStatus(room))
        .select(
          "id,created_at,subject, file_name, file_url, profiles(name,status)"
        )
        .eq("subject", e.value)
        .then((response) => {
          if (!response.error) {
            setAllFetchFiles(response.data);
            setLoader(false);
          }
          setLoader(false);
        });
    }
  }

  return (
    <div>
      <HomeLayout>
        <div>
          <div className="">
            <hr />
            <h1 className="text-xl text-center p-1">
              {/* {` File Sharing NOTES And Project Submission ${status}`} */}
              Notes by teacher
            </h1>
            <hr />
          </div>
          {loginUserProfile?.status == "teacher" && (
            <div className="flex">
            <div className=" flex w-9/12">
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
                      allUploadedFilesFromSupabase.length !==
                        allUploadedFilesFromLocal.length &&
                      "pointer-events-none"
                    } ${
                      allUploadedFilesFromLocal.length === 0 &&
                      "pointer-events-none"
                    } ${!fileName && 'pointer-events-none'}`}
                  >
                    <div>
                      <CloudArrowUpIcon
                        className={`h-8 ${
                          allUploadedFilesFromSupabase.length !==
                            allUploadedFilesFromLocal.length && "text-gray-300"
                        } ${
                          allUploadedFilesFromLocal.length === 0 &&
                          "text-gray-300"
                        }${!fileName && 'text-gray-300'}`}
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
                        src={`https://upload.wikimedia.org/wikipedia/commons/0/01/Google_Docs_logo_%282014-2020%29.svg`}
                        alt="thumbnail"
                        height={66}
                        width="60"
                      />
                    ))}
                  </div>
                )}
                {allUploadedFilesFromLocal.length !==
                  allUploadedFilesFromSupabase.length && (
                  <div className="ml-10 opacity-40 absolute ">
                    <Rings />
                  </div>
                )}
              </div>
            </div>
              <div className="w-3/12 flex justify-end items-center">
                <input
                  className="p-1 h-10 rounded-md border border-blue-400 outline-blue-600"
                  type="text"
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="file title"
                />
              </div>
            </div>
          )}
          <hr />
          <div className="mt-2  flex justify-end">
            <Select
              id="selectbox"
              onChange={handleOptionsChange}
              className="w-40"
              instanceId="selectbox"
              options={subjectName[room]}
            />
          </div>
          {loader && (
            <div className="flex justify-center">
              <Loader />
            </div>
          )}
          {AllFetchFiles.length == 0 && !loader && (
            <div>
              <p className="text-red-600">Sorry, No Notes Found..</p>
            </div>
          )}
          <div className=" grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-5 justify-between mt-5">
            {AllFetchFiles.length > 0 &&
              AllFetchFiles.map((file) => (
                <ShowSharingList {...file} key={file.id} />
              ))}
          </div>
        </div>
        <div className="flex justify-center mt-6">
          {!false && (
            <button
              // disabled={loadMoreDisabled}
              className="flex py-2 px-8 border-[#d6d6d6]  border-2 text-gray-700"
              // onClick={handleLoadMore}
            >
              <ArrowDownIcon className="h-6 text-[#5553ff]" />
              Currently not working
            </button>
          )}
        </div>
      </HomeLayout>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { room } = context.query;
  const table_name = GetTableFromStatus(room);
  const data = await supabase
    .from(table_name)
    .select("id,created_at,subject, file_name, file_url, profiles(id,name,status)")
    .limit(10)
    .order("created_at",{ascending:false});

    console.log(data)

  return {
    props: {
      AllFiles: data.data,
    },
  };
}
