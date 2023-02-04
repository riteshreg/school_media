import ChatDisplay from "@/components/ChatDisplay";
import HomeLayout from "@/components/HomeLayout";
import GetProfile from "@/helper/GetProfile";
import { supabase } from "@/supabase";
import { UserContext } from "@/UserContext";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import TextareaAutosize from "react-autosize-textarea";

function MessagingPage({ fetch_messages }) {
  const [content, setContent] = useState("");
  const [loginUserData, setLoginUserData] = useState();

  const {
    messages,
    setMessages,
    scrollToBottom,
    setFirstScrollBottom,
    setStatus,
    loginUserProfile,
    setLoginUserProfile,
    prevMessagesUploadedFiles,
    setMessagesUploadedFiles,
    setPrevMessagesUploadedFiles,
    messagesUploadedFiles,
  } = useContext(UserContext);

  const reversed = messages && [...messages].reverse();

  const router = useRouter();
  const { pathname } = router;
  const { status, id } = router.query;
  const supabase = useSupabaseClient();
  const session = useSession();

  useEffect(() => {
    if (status) {
      setStatus(status);
    }
  });

  useEffect(() => {
    if (!loginUserProfile && id) {
      GetProfile(id, setLoginUserProfile);
    }
  }, [id]);

  useEffect(() => {
    if (
      loginUserProfile?.status !== "teacher" &&
      loginUserProfile?.status &&
      loginUserProfile?.status !== status
    ) {
      router.push("/");
    }
  });

  useEffect(() => {
    setMessages(fetch_messages);
    if(fetch_messages){
      setFirstScrollBottom(true);
    }
    
    if (pathname == "/messages/[id]/[status]") {
      scrollToBottom();
    }
  }, []);

  useEffect(() => {
    setLoginUserData(session?.user);
  });

  const handleSendMessage = () => {
    supabase
      .from(
        `${
          (status == 12 && "messages") ||
          (status == 11 && "class_11_messages") ||
          (status == 10 && "class_10_messages") ||
          (status == 9 && "class_9_messages")
        }`
      )
      .insert({
        content,
        author: loginUserData?.id,
        author_name: loginUserData?.email.split("@")[0],
        images: messagesUploadedFiles,
      })
      .then((response) => {
        setContent("");
        setPrevMessagesUploadedFiles([]);
        setMessagesUploadedFiles([]);
      });
  };

  const handleUploadFiles = (event) => {
    //handleChangeFunction
    const files = event.target.files;
    for (const file of files) {
      setPrevMessagesUploadedFiles((prev) => [
        ...prev,
        URL.createObjectURL(file),
      ]);
    }
    for (const file of files) {
      const newName = new Date().getTime() + file.name;
      supabase.storage
        .from("images")
        .upload(newName, file)
        .then((resp) => {
          const url =
            "https://ypticbcztdwpynckjwag.supabase.co/storage/v1/object/public/images/" +
            resp.data.path;
          setMessagesUploadedFiles((prev) => [...prev, url]);
        });
    }
  };

  return (
    <HomeLayout>
      <div className="bg-gray-50 ">
        <div>
          <h1 className="text-xl text-center font-semibold text-gray-600">
            {`Janata Mavi Class ${status} Messaging Group`}
          </h1>
        </div>

        <div className="container mx-auto">
          <div className="lg:col-span-2 lg:block">
            <div className="w-full">
              <div className="relative flex items-center p-1 border-b border-gray-300" />
              <ChatDisplay loginUserData={loginUserData} messages={reversed} />
              {/* {UploadedFiles.length > 0 && (
                <div
                  className={`w-fit ${
                    UploadedFiles.length == 2 && "grid gap-2 grid-cols-2"
                  } ${UploadedFiles.length > 2 && "grid grid-col-4"}`}
                >
                  {UploadedFiles.map((file) => (
                    <Image
                      key={file}
                      src={file}
                      height={90}
                      width={100}
                      alt="photo"
                    />
                  ))}
                </div>
              )} */}
              <div className="p-3 border-t border-gray-300">
                {prevMessagesUploadedFiles.length > 0 && (
                  <div className="md:ml-5 flex space-x-1">
                    {prevMessagesUploadedFiles.map((image) => (
                      <Image
                        key={image}
                        className={`rounded-md ${
                          prevMessagesUploadedFiles.length ==
                          messagesUploadedFiles.length
                            ? "grayscale-0"
                            : "grayscale"
                        }`}
                        alt="img"
                        height={55}
                        width={55}
                        src={image}
                      />
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between w-full ">
                  <label className="py-1">
                    <input
                      multiple
                      type="file"
                      onChange={handleUploadFiles}
                      className="hidden"
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokelinejoininejoin="round"
                        strokeWidth="2"
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                      />
                    </svg>
                  </label>

                  <TextareaAutosize placeholder="send messages..." 
                   onKeyDown={(e) => {
                    if (e.key === "Enter" && content) {
                      handleSendMessage();
                    }
                  }}
                       value={content}
                       onChange={(event) => setContent(event.target.value)}
                       className="block w-full py-2 pl-4 mx-3 bg-gray-100 rounded-full outline-none focus:text-gray-700"
                  />
            
                  <button onClick={handleSendMessage}>
                    <svg
                      className="w-5 h-5 text-gray-500 origin-center transform rotate-90"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}

export async function getServerSideProps(context) {
  const { status } = context.query;

  const data = await supabase
    .from(
      `${
        (status == 12 && "messages") ||
        (status == 11 && "class_11_messages") ||
        (status == 10 && "class_10_messages") ||
        (status == 9 && "class_9_messages")
      }`
    )
    .select("*")
    .range(0, 10)
    .order("id", { ascending: false });

  return {
    props: {
      fetch_messages: data.data,
    },
  };
}

export default MessagingPage;
