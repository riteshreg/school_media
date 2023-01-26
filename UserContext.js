import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { createContext, useEffect, useRef, useState } from "react";

export const UserContext = createContext({})

export const UserContextProvider = ({children}) =>{


  const supabase = useSupabaseClient();
  const session = useSession()

      
  const [loginUserId, setLoginUserId] = useState()
  const [scrollPosition, setScrollPosition] = useState(0);
  const [messages, setMessages] = useState([])
  const [loginUserProfile, setLoginUserProfile] = useState()
  const [isOnBottom, setIsOnBottom] = useState(false);
  const [firstScrollBottom, setFirstScrollBottom] = useState(false)
  const [status, setStatus] = useState(null)

  

  const [newIncomingMessageTrigger, setNewIncomingMessageTrigger] =   useState(null);
  

  const scrollRef = useRef();


  // useEffect(()=>{
  //   setLoginUserId(session?.user)
  //   console.log("running")
  // },[loginUserId==null])


  useEffect(()=>{
    scrollToBottom()
  },[newIncomingMessageTrigger])

  useEffect(()=>{
    scrollToBottom()
  },[firstScrollBottom])
  
  // sdf??
  useEffect(()=>{
      if(status){
       supabase
       .from(`${status==12 && "messages" || status==11 && "class_11_messages" || status==10 && "class_10_messages" || status == 9 && "class_9_messages"}`)
    .select("*")
    .range(0, 10)
    .order("id", { ascending: false })
    .then((response) => {
      setMessages(response.data);
      setFirstScrollBottom(true)
    });
  }   
  },[status])


  useEffect(() => {
   if(loginUserProfile?.status){
     supabase.channel("schema-db-changes")
     .on(
       'postgres_changes',
       {
         event:"*",
         schema:"public",
         table: `${status == "12" && "messages" || status == "11" && "class_11_messages" || status == "10" && "class_10_messages" || status == "9" && "class_9_messages"}`
       },
       (payload) => { 
         setMessages(prev=>[payload.new, ...prev])
         setNewIncomingMessageTrigger(payload.new)
       }
     ).subscribe()
   }
  });


  const onScroll = async ({ target }) => {
    if (target.scrollHeight - target.scrollTop <= target.clientHeight + 1) {
      setIsOnBottom(true);
    } else {
      setIsOnBottom(false);
    }

    //* Load more messages when reaching top
    if (target.scrollTop === 0) {
      // console.log("messages.length :>> ", messages.length);
      const { data, error } = await supabase
      .from(`${status==12 && "messages" || status==11 && "class_11_messages" || status==10 && "class_10_messages" || status == 9 && "class_9_messages"}`)
      .select()
        .range(messages.length, messages.length + 20)
        .order("id", { ascending: false });
      if (error) {
        setError(error.message);
        return;
      }
      target.scrollTop = 1;
      setMessages((prevMessages) => [...prevMessages, ...data]);
    }
  };


  const scrollToBottom = () => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  };





    return(
        <UserContext.Provider value={{
                     loginUserId, setLoginUserId, 
                     scrollPosition, setScrollPosition,
                     messages, setMessages, 
                     onScroll,
                     scrollToBottom,
                     scrollRef,
                     loginUserProfile,
                     setLoginUserProfile,
                     setStatus,
                     }}>
            {children}
        </UserContext.Provider>
    )
}