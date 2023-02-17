import HomeLayout from "@/components/HomeLayout";
import StudentNavigator from "@/components/StudentNavigator";
import { supabase } from "@/supabase";
import { UserContext } from "@/UserContext";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { MagnifyingGlass } from "react-loader-spinner";


function Messages({userProfile}) {
  const [hold, setHold] = useState(false);
  const router = useRouter();
  // const { loginUserProfile, setLoginUserProfile } = useContext(UserContext);


  // useEffect(() => {
  //  setLoginUserProfile(userProfile)
  // }, [hold]);
  const {id} = router.query




  useEffect(() => {
    if (
      userProfile?.status == 11 ||
      userProfile?.status == 12 ||
      userProfile?.status == 9 ||
      (userProfile?.status == 10 && userProfile?.status)
    ) {
      router.replace(`/messages/${id}/${userProfile.status}`,undefined, { shallow: true });
    } else if (userProfile?.status == "teacher") {
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
                    <StudentNavigator
                      status={9}
                      title="Class Nine"
                      description={
                        "Class Nine consist of 48 student with lorem ipsum as Class Teacher"
                      }
                    />
                  </div>
                  <div
                    className="cursor-pointer"
                    onClick={() => router.push(`/messages/${id}/10`)}
                  >
                   <StudentNavigator
                      status={10}
                      title="Class Ten"
                      description={
                        "Class Ten consist of 48 student with lorem ipsum as Class Teacher"
                      }
                    />
                  </div>
                  <div
                    className="cursor-pointer"
                    onClick={() => router.push(`/messages/${id}/11`)}
                  >
                   <StudentNavigator
                      status={11}
                      title="Class Eleven"
                      description={
                        "Class Eleven consist of 48 student with lorem ipsum as Class Teacher"
                      }
                    />
                  </div>
                  <div
                    className="cursor-pointer"
                    onClick={() => router.push(`/messages/${id}/12`)}
                  >
                   <StudentNavigator
                      status={12}
                      title="Class Twelve"
                      description={
                        "Class Twelve consist of 48 student with lorem ipsum as Class Teacher"
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