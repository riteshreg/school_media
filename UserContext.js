import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { createContext, useEffect, useRef, useState } from "react";

export const UserContext = createContext({})

export const UserContextProvider = ({children}) =>{


  const supabase = useSupabaseClient();
  const session = useSession()

      
  const [loginUserId, setLoginUserId] = useState()
  const [scrollPosition, setScrollPosition] = useState(0);
  const [loginUserProfile, setLoginUserProfile] = useState()
  const [isOnBottom, setIsOnBottom] = useState(false);
  const [status, setStatus] = useState(null)

  const [loginAsAdmin, setLoginAsAdmin]  = useState(false)

  const [prevMessagesUploadedFiles, setPrevMessagesUploadedFiles] = useState([])
  const [messagesUploadedFiles, setMessagesUploadedFiles] = useState([])

  



 
  useEffect(()=>{
      if(loginUserId?.id == "470505ee-5319-441e-9185-34a0eaa2027e"){
        setLoginAsAdmin(true)
      }
  },[loginUserId])
  
  

    return(
        <UserContext.Provider value={{
                     loginUserId, setLoginUserId, 
                     scrollPosition, setScrollPosition,
                      loginUserProfile,
                     setLoginUserProfile,
                     setStatus,
                     messagesUploadedFiles,setMessagesUploadedFiles,
                     prevMessagesUploadedFiles,setPrevMessagesUploadedFiles,
                     loginAsAdmin,
                     }}>
            {children}
        </UserContext.Provider>
    )
}