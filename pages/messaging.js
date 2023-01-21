import HomeLayout from "@/components/HomeLayout";
import { GetLoginUserData } from "@/helper/GetLoginUserData";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";


function MessagingPage() {
  const [content, setContent] = useState("");
  const [loginUserData, setLoginUserData] = useState();
  const [messages, setMessages] = useState([]);

  const messagesEndRef = useRef(null)

  const supabase = useSupabaseClient();



  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    supabase
      .from("messages")
      .select("*")
      .limit(50)
      .order("created_at", {ascending:true})
      .then((response) => {
        setMessages(response.data);
      });

    GetLoginUserData().then((response) => {
      if (response.session?.user) {
        setLoginUserData(response.session?.user);
      }
    });
  }, []);

  useEffect(()=>{
    scrollToBottom()
  },[messages])

  useEffect(() => {
    supabase
      .channel("public:currently_searching")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        (payload) => {
        
            setMessages(prev=>[...prev, payload.new])
        }
      )
      .subscribe();

      
  },[]);

  const handleSendMessage = () => {
    supabase
      .from("messages")
      .insert({
        content,
        author: loginUserData?.id,
        author_name:loginUserData?.user_metadata?.name
      })
      .then((response) => {
          setContent("")
      });
  };


  return (
    <HomeLayout>
      <div>
        <div>
          <h1 className="text-xl text-center font-semibold text-gray-600">
            School Messaging Group
          </h1>
        </div>
       
<div className="container mx-auto">
      
        <div className="lg:col-span-2 lg:block">
          <div className="w-full">
            <div className="relative flex items-center p-3 border-b border-gray-300">
              <Image width={480} height={480} className="object-cover w-10 h-10 rounded-full"
                src="https://cdn.pixabay.com/photo/2017/04/19/17/26/people-2243021_960_720.jpg" alt="username" />
              <span className="block ml-2 font-bold text-gray-600">School</span>
              <span className="absolute w-3 h-3 bg-green-600 rounded-full left-10 top-3">
              </span>
            </div>
            <div  className="relative w-full p-6 overflow-y-auto h-[25rem] ">
              {messages.length>0 && messages.map((message)=>
              <ul className="space-y-2 my-5 " key={message.id}>
               {message.author!== loginUserData?.id &&  <li className="flex justify-start">
                  <div className="relative max-w-xl px-4 py-2 text-gray-700 bg-slate-200 rounded shadow">
                    <div>
                      <span className="text-xs  text- text-gray-600">@{message.author_name}</span>
                      <span className="block">{message.content}</span>
                      </div>
                  </div>
                </li>}
                {message.author == loginUserData?.id && <li className="flex justify-end">
                  <div className="relative max-w-xl px-4 py-2 text-gray-700 bg-blue-300 rounded shadow">
                   <span className="block">{message.content}</span>
                  </div>
                </li>
                }
              </ul>)}
              <div ref={messagesEndRef} />

            </div>

            <div className="flex items-center justify-between w-full p-3 border-t border-gray-300">
              
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path strokeLinecap="round" strokelinejoininejoin="round" strokeWidth="2"
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>

              <input onKeyDown={(e)=>{
                if(e.key==="Enter" && content){
                    handleSendMessage()
                    }
              }} type="text" value={content} onChange={(event)=>setContent(event.target.value)} placeholder="Message"
                className="block w-full py-2 pl-4 mx-3 bg-gray-100 rounded-full outline-none focus:text-gray-700"
                 />
              
              <button disabled={!content} onClick={handleSendMessage}>
                <svg className="w-5 h-5 text-gray-500 origin-center transform rotate-90" xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20" fill="currentColor">
                  <path
                    d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

        </div>
        
    </HomeLayout>
  );
}

export default MessagingPage;
