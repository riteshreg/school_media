import ChatDisplay from "@/components/ChatDisplay";
import HomeLayout from "@/components/HomeLayout";
import GetProfile from "@/helper/GetProfile";
import { supabase } from "@/supabase";
import { UserContext } from "@/UserContext";
import { ArrowSmallLeftIcon } from "@heroicons/react/24/outline";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-autosize-textarea";
import { v4 as uuidv4 } from "uuid";

function MessagingPage({ fetch_messages }) {
  const [content, setContent] = useState("");
  const [loginUserData, setLoginUserData] = useState();
  const [messages, setMessages] = useState([]);
  const [newIncomingMessageTrigger, setNewIncomingMessageTrigger] =
    useState(null);
  const [firstScrollBottom, setFirstScrollBottom] = useState(false);

  const [disabledSendButton, setDisabledSendButton] = useState(false);

  let reversed  =   messages && [...messages].reverse();

  const {
    setStatus,
    loginUserProfile,
    setLoginUserProfile,
    prevMessagesUploadedFiles,
    setMessagesUploadedFiles,
    setPrevMessagesUploadedFiles,
    messagesUploadedFiles,
  } = useContext(UserContext);

  


  const router = useRouter();
  const { pathname } = router;
  const { status, id } = router.query;
  const supabase = useSupabaseClient();
  const session = useSession();


  const scrollRef = useRef();

  function scrollToBottom() {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }

  useEffect(() => {
    if (status) {
      setStatus(status);
    }
  });

  useEffect(() => {
    scrollToBottom();
  }, [newIncomingMessageTrigger]);

  useEffect(() => {
    scrollToBottom();
  }, [firstScrollBottom]);

  useEffect(() => {
    if (!loginUserProfile && id) {
      console.log("hey", GetProfile(id, setLoginUserProfile));
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
    if (fetch_messages) {
      setFirstScrollBottom(true);
    }

    if (pathname == "/messages/[id]/[status]") {
      scrollToBottom();
    }
    

    // reversing the messaging
  }, []);

  useEffect(() => {
    setLoginUserData(session?.user);
  });

  const handleSendMessage = () => {
    setDisabledSendButton(true);

    if ((!content && messagesUploadedFiles.length < 1) || disabledSendButton) {
      return;
    }
    if (content) {
      setMessages((prev) => [
        ...prev,
        {
          author: loginUserData?.id,
          author_name: loginUserProfile?.name,
          content: content,
          created_at: null,
          id: uuidv4(),
          images: messagesUploadedFiles,
        },
      ]);
    }
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
        setDisabledSendButton(false);
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

  // realtime messaging
  useEffect(() => {
    if (status) {
      supabase
        .channel("schema-db-changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: `${
              (status == "12" && "messages") ||
              (status == "11" && "class_11_messages") ||
              (status == "10" && "class_10_messages") ||
              (status == "9" && "class_9_messages")
            }`,
          },
          (payload) => {
            console.log(payload);
            if (payload.new?.author == loginUserData?.id) {
              return;
            }
            setMessages((prev) => [payload.new, ...prev]);
            setNewIncomingMessageTrigger(payload.new);
          }
        )
        .subscribe();
    }
  }, []);

  // end realtime messaing

  const onScroll = async ({ target }) => {
    //* Load more messages when reaching top
    if (target.scrollTop === 0) {
      // console.log("messages.length :>> ", messages.length);
      const { data, error } = await supabase
        .from(
          `${
            (status == 12 && "messages") ||
            (status == 11 && "class_11_messages") ||
            (status == 10 && "class_10_messages") ||
            (status == 9 && "class_9_messages")
          }`
        )
        .select()
        .range(messages?.length, messages?.length + 20)
        .order("id", { ascending: false });
      if (error) {
        setError(error.message);
        return;
      }
      setMessages((prevMessages) => [...prevMessages, ...data]);
      target.scrollTop = 1;
    }
  };

  return (
    <HomeLayout hidden={true}>
      <div className=" w-full bg-gray-50 ">
        <div className="flex justify-center items-center">
          <ArrowSmallLeftIcon
            onClick={() => router.push("/")}
            className="h-12 md:hidden"
          />
          <h1 className="text-xl text-center font-semibold text-gray-600">
            {`Janata Mavi Class ${status} Messaging Group`}
          </h1>
        </div>

        <div className="container mx-auto">
          <div className="lg:col-span-2 lg:block">
            <div className="w-full">
              <div className="relative flex items-center p-1 border-b border-gray-300" />
              <ChatDisplay
                decHeight={prevMessagesUploadedFiles}
                scrollRef={scrollRef}
                loginUserData={loginUserData}
                messages={reversed?.length>0 && reversed}
                onScroll={onScroll}
              />

              <div className="p-3  border-t border-gray-300">
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
                <div className="flex mt-2 items-center justify-between w-full ">
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

                  <TextareaAutosize
                    maxRows={4}
                    placeholder="send messages..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (content || messagesUploadedFiles) {
                          handleSendMessage();
                        }
                      }
                    }}
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    className="  block w-full py-2 pl-4 mx-3 text-black bg-gray-200 rounded-sm outline-none focus:text-gray-700"
                  />

                  <button
                    disabled={disabledSendButton}
                    onClick={handleSendMessage}
                  >
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
