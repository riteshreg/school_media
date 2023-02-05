import Card from "@/components/Card";
import HomeLayout from "@/components/HomeLayout";
import ShowAllGroup from "@/components/ShowAllGroup";
import GetProfile from "@/helper/GetProfile";
import { supabase } from "@/supabase";
import { UserContext } from "@/UserContext";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { MagnifyingGlass } from "react-loader-spinner";


function Messages({userProfile}) {
  const [hold, setHold] = useState(false);
  const router = useRouter();
  const { loginUserProfile, setLoginUserProfile } = useContext(UserContext);

  const supabase = useSupabaseClient();

  const {id} = router.query

  useEffect(() => {
   setLoginUserProfile(userProfile)
  }, []);

  useEffect(() => {
    if (
      loginUserProfile?.status == 11 ||
      loginUserProfile?.status == 12 ||
      loginUserProfile?.status == 9 ||
      (loginUserProfile?.status == 10 && loginUserProfile?.status)
    ) {
      router.push(`/messages/${id}/${loginUserProfile.status}`);
    } else if (loginUserProfile?.status == "teacher") {
      setHold(true);
    }
  });

  return (
        <HomeLayout>
            {!hold && 
              <div className="">
                <MagnifyingGlass
                  visible={true}
                  height="80"
                  width="80"
                  ariaLabel="MagnifyingGlass-loading"
                  wrapperStyle={{}}
                  wrapperClass="MagnifyingGlass-wrapper"
                  glassColor="#c0efff"
                  color="#e15b64"
                />
              </div>
            }
            {hold && (
              <div>
                <h1 className="text-xl text-center mr-8 font-semibold text-gray-700 mb-10">
                  Messaging Group List
                </h1>
                <div className="space-y-5">
                  <div
                    className="cursor-pointer"
                    onClick={() => router.push(`/messages/${id}/9`)}
                  >
                    <ShowAllGroup
                      classNumber={9}
                      status="Nine"
                      desc={
                        "Class Nine consist of 48 student with lorem ipsum as Class Teacher"
                      }
                    />
                  </div>
                  <div
                    className="cursor-pointer"
                    onClick={() => router.push(`/messages/${id}/10`)}
                  >
                    <ShowAllGroup
                      classNumber={10}
                      status="Ten"
                      desc={
                        "Class Ten consist of 48 student with lorem ipsum as Class Teacher"
                      }
                    />
                  </div>
                  <div
                    className="cursor-pointer"
                    onClick={() => router.push(`/messages/${id}/11`)}
                  >
                    <ShowAllGroup
                      classNumber={11}
                      status="Eleven"
                      desc={
                        "Class Eleven consist of 48 student with lorem ipsum as Class Teacher"
                      }
                    />
                  </div>
                  <div
                    className="cursor-pointer"
                    onClick={() => router.push(`/messages/${id}/12`)}
                  >
                    <ShowAllGroup
                      classNumber={12}
                      status="Twevel"
                      desc={
                        "Class Twevel consist of 48 student with lorem ipsum as Class Teacher"
                      }
                    />
                  </div>
                </div>
              </div>
            )}
        </HomeLayout>
  );
}

export default Messages;


export async function getServerSideProps(context){

  const data = await supabase.from("profiles").select().eq("id",context.query.id)

  return{
    props:{
        userProfile:data?.data?.[0]
    }
  }
}