import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { createContext, useEffect, useRef, useState } from "react";

export const UserContext = createContext({})

export const UserContextProvider = ({children}) =>{


  const supabase = useSupabaseClient();
      
  const [loginUserData, setLoginUserData] = useState("riteshreg")
  const [scrollPosition, setScrollPosition] = useState(0);
  const [messages, setMessages] = useState([])
  const [isOnBottom, setIsOnBottom] = useState(false);
  const [firstScrollBottom, setFirstScrollBottom] = useState(false)

  

  const [newIncomingMessageTrigger, setNewIncomingMessageTrigger] =   useState(null);
  

  const scrollRef = useRef();

  console.log(messages)

  useEffect(()=>{
    scrollToBottom()
  },[newIncomingMessageTrigger])

  useEffect(()=>{
    scrollToBottom()
  },[firstScrollBottom])

  useEffect(()=>{
    supabase
    .from("messages")
    .select("*")
    .range(0, 10)
    .order("id", { ascending: false })
    .then((response) => {
      setMessages(response.data);
      setFirstScrollBottom(true)
    });
  },[])

  useEffect(() => {
   
    supabase.channel("schema-db-changes")
    .on(
      'postgres_changes',
      {
        event:"*",
        schema:"public",
        table:"messages"
      },
      (payload) => { 
        setMessages(prev=>[payload.new, ...prev])
        setNewIncomingMessageTrigger(payload.new)
      }
    ).subscribe()
  },);


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
        .from("messages")
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
                     loginUserData, setLoginUserData, 
                     scrollPosition, setScrollPosition,
                     messages, setMessages, 
                     onScroll,
                     scrollToBottom,
                     scrollRef,
                     
                     }}>
            {children}
        </UserContext.Provider>
    )
}