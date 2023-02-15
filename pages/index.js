// import HomeLayout from "@/components/HomeLayout";
// import CreatePost from "@/components/post/CreatePost";
// import PostDispaly from "@/components/post/PostDisplay";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/UserContext";
import {
  useSession,
  useSupabaseClient,
} from "@supabase/auth-helpers-react/dist";
import { supabase } from "@/supabase";
import dynamic from "next/dynamic";
import { ArrowDownIcon } from "@heroicons/react/24/outline";
import { Oval } from "react-loader-spinner";

import NewsNavbar from "@/components/NewsNavbar";
import CreatePost from "../components/post/CreatePost";
import { useRouter } from "next/router";
import Head from "next/head";

const PostDispaly = dynamic(() => import("../components/post/PostDisplay"));
const HomeLayout = dynamic(() => import("../components/HomeLayout"));

export default function Home({ data }) {
  const [loginUser, setLoginUser] = useState();
  const [AllPost, setAllPost] = useState([]);

  const [loadMoreDisabled, setLoadMoreDisabled] = useState(false);

  const session = useSession();
  const { setLoginUserId } = useContext(UserContext);

  const supabase = useSupabaseClient();
  const router = useRouter();

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

  const handleLoadMore = () => {
    setLoadMoreDisabled(true);
    supabase
      .from("posts")
      .select("id,author,content, images, created_at")
      .order("created_at", { ascending: false })
      .range(AllPost.length, AllPost.length + 5)
      .then((response) => {
        if (response.error) {
          setLoadMoreDisabled(fasle);
          throw response.error;
        }
        if (response.data) {
          setAllPost((prev) => [...prev, ...response.data]);
          setLoadMoreDisabled(false);
        }
      });
  };


  return (
    <div>
      <Head>
        <title>Janata Mavi</title>
      </Head>

      <HomeLayout>
        <NewsNavbar />
        <div className="space-y-4 mb-14 md:mb-8 h-full">
          {loginUser?.id == "470505ee-5319-441e-9185-34a0eaa2027e" && (
            <CreatePost FetchAllPost={FetchAllPost} />
          )}
          <div>
            {AllPost?.length > 0 &&
              AllPost?.map((item) => (
                <PostDispaly key={item.id} {...item} loginUser={loginUser} />
              ))}
          </div>
          <div className=" flex pb-4 justify-center">
            {!loadMoreDisabled && (
              <button
                disabled={loadMoreDisabled}
                className="flex py-2 px-8 border-[#d6d6d6]  border-2 text-gray-700"
                onClick={handleLoadMore}
              >
                <ArrowDownIcon className="h-6 text-[#5553ff]" /> Load More...
              </button>
            )}
            {loadMoreDisabled && (
              <Oval
                ariaLabel="loading-indicator"
                height={50}
                width={50}
                strokeWidth={5}
                strokeWidthSecondary={1}
                color="blue"
                secondaryColor="white"
              />
            )}
          </div>
        </div>
      </HomeLayout>
    </div>
  );
}

export async function getServerSideProps(context) {
  const data = await supabase
    .from("posts")
    .select("id,author,content, images, created_at")
    .order("created_at", { ascending: false })
    .limit(8);
  return {
    props: {
      data: data.data,
    },
  };
}
