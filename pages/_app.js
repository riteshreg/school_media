import "@/styles/globals.css";
import { UserContext } from "@/UserContext";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { useState } from "react";

export default function App({ Component, pageProps }) {
  const [loginUserData, setLoginUserData] = useState("riteshreg")
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <UserContext.Provider value={{loginUserData, setLoginUserData}}>
        <Component {...pageProps} />
      </UserContext.Provider>
    </SessionContextProvider>
  );
}
