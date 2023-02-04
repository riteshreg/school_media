import HomeLayout from "@/components/HomeLayout";
import CreatePost from "@/components/post/CreatePost";
import PostDispaly from "@/components/post/PostDisplay";
import { useContext, useEffect, useState } from "react";
import LoginPage from "./login";
import { UserContext } from "@/UserContext";
import {
  useSession,
  useSupabaseClient,
} from "@supabase/auth-helpers-react/dist";
import { supabase } from "@/supabase";

export default function Home({ data }) {
  const [loginUser, setLoginUser] = useState();
  const [AllPost, setAllPost] = useState([]);
 

  const session = useSession();
  const { setLoginUserId, loginAsAdmin} = useContext(UserContext);

  const supabase = useSupabaseClient();

  useEffect(() => {
    setAllPost(data);
  }, []);


  useEffect(() => {
    if (session?.user) {
      setLoginUserId(session.user);
      setLoginUser(session.user);
    }
  }, [session, setLoginUserId]);

  function FetchAllPost() {
    supabase
      .from("posts")
      .select("id,author,content, images, created_at")
      .order("id", { ascending: false })
      .limit(6)
      .then((response) => {
        if (response.error) {
          throw response.error;
        }
        if (response.data) {
          setAllPost(response.data);
        }
      });
  }

  if (!loginUser) {
    return <LoginPage />;
  }

  return (
    <HomeLayout>
      <div className="space-y-4 h-full"  >
        {loginAsAdmin && <CreatePost FetchAllPost={FetchAllPost} />}
        {AllPost?.length > 0 &&
          AllPost?.map((item) => (
            <PostDispaly key={item.id} {...item} loginUser={loginUser} />
          ))}
      </div>
    </HomeLayout>
  );
}

export async function getServerSideProps(context) {
  const data = await supabase
    .from("posts")
    .select("id,author,content, images, created_at")
    .order("created_at", { ascending: false })
    .limit(5)
    return {
    props: {
      data:data.data,
    },
  };
}
