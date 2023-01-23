import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { createContext, useEffect, useRef, useState } from "react";

export const UserContext = createContext({})

export const UserContextProvider = ({children}) =>{


  const supabase = useSupabaseClient();
      
  const [loginUserData, setLoginUserData] = useState("riteshreg")
  const [scrollPosition, setScrollPosition] = useState(0);
  const [messages, setMessages] = useState([])
  const [isOnBottom, setIsOnBottom] = useState(false);

  const [unviewedMessageCount, setUnviewedMessageCount] = useState(0);

  const [newIncomingMessageTrigger, setNewIncomingMessageTrigger] =   useState(null);







  const scrollRef = useRef();

  useEffect(()=>{
    scrollToBottom()
  },[newIncomingMessageTrigger])

  useEffect(()=>{
    supabase
    .from("messages")
    .select("*")
    .range(0, 5)
    .order("id", { ascending: false })
    .then((response) => {
      setMessages(response.data);
      scrollToBottom()
    });
  },[])

  useEffect(() => {
    supabase
      .channel("public:currently_searching")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        (payload) => {
          setMessages((prev) => [payload.new, ...prev]);
          scrollToBottom()
          setNewIncomingMessageTrigger(payload.new)
        }
      )
      .subscribe();
  }, [supabase]);


  const onScroll = async ({ target }) => {
    if (target.scrollHeight - target.scrollTop <= target.clientHeight + 1) {
      setUnviewedMessageCount(0);
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
                     scrollRef
                     }}>
            {children}
        </UserContext.Provider>
    )
}