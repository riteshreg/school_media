import "@/styles/globals.css";
import { UserContext, UserContextProvider } from "@/UserContext";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { useState } from "react";
import TimeAgo from "javascript-time-ago";
import en from 'javascript-time-ago/locale/en.json'


export default function App({ Component, pageProps }) {
  
  TimeAgo.addDefaultLocale(en);

  const [supabaseClient] = useState(() => createBrowserSupabaseClient());

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <UserContextProvider>
        <Component {...pageProps} />
      </UserContextProvider>
    </SessionContextProvider>
  );
}
