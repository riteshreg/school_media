// import HomeLayout from "@/components/HomeLayout";
// import CreatePost from "@/components/post/CreatePost";
// import PostDispaly from "@/components/post/PostDisplay";
import { useContext, useEffect, useState } from "react";
import LoginPage from "./login";
import { UserContext } from "@/UserContext";
import {
  useSession,
  useSupabaseClient,
} from "@supabase/auth-helpers-react/dist";
import { supabase } from "@/supabase";
import dynamic from "next/dynamic";

const PostDispaly = dynamic(()=>import('../components/post/PostDisplay'))
const HomeLayout = dynamic(()=>import('../components/HomeLayout'))
const CreatePost = dynamic(()=>import('../components/post/CreatePost'))

export default function Home({ data }) {
  const [loginUser, setLoginUser] = useState();
  const [AllPost, setAllPost] = useState([]);

  const [loadMoreDisabled, setLoadMoreDisabled] = useState(false)
 

  const session = useSession();
  const { setLoginUserId, loginAsAdmin} = useContext(UserContext);

  const supabase = useSupabaseClient();

  useEffect(() => {
    setAllPost(data);
  }, []);

  useEffect(()=>{
    supabase.channel("schema-db-changes")
    .on(
      'postgres_changes',
      {
        event:"*",
        schema:"public",
        table:'posts'
      },
      (payload) => { 
        setAllPost(prev=>[payload.new, ...prev])
      }
    ).subscribe()
  })


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
      .order("created_at", { ascending: false })
      .limit(8)
      .then((response) => {
        if (response.error) {
          throw response.error;
        }
        if (response.data) {
          setAllPost(response.data);
        }
      });
  }

  const handleLoadMore = () =>{
    setLoadMoreDisabled(true)
    supabase
    .from("posts")
    .select("id,author,content, images, created_at")
    .order("created_at", { ascending: false })
    .range(AllPost.length, AllPost.length+5)
    .then((response) => {
      if (response.error) {
        throw response.error;
      }
      if (response.data) {
        setAllPost(prev=>[...prev, ...response.data]);
        setLoadMoreDisabled(false)
      }
    });
  }

  if (!loginUser) {
    return <LoginPage />;
  }


  return (
    <HomeLayout>
      <div className="space-y-4 mb-20 md:mb-8 h-full"  >
        {loginAsAdmin && <CreatePost FetchAllPost={FetchAllPost} />}
        {AllPost?.length > 0 &&
          AllPost?.map((item) => (
            <PostDispaly key={item.id} {...item} loginUser={loginUser} />
          ))}
          <div className=" flex justify-center">
            <button disabled={loadMoreDisabled}  className="text-gray-900" onClick={handleLoadMore}>Load More...</button>
          </div>
          
      </div>
    </HomeLayout>
  );
}

export async function getServerSideProps(context) {
  const data = await supabase
    .from("posts")
    .select("id,author,content, images, created_at")
    .order("created_at", { ascending: false })
    .limit(8)
    return {
    props: {
      data:data.data,
    },
  };
}
