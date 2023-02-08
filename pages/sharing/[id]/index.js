import StudentNavigator from "@/components/StudentNavigator";
import HomeLayout from "@/components/HomeLayout";
import Link from "next/link";
import TeacherNavigator from "@/components/filesharing/TeacherNavigator";
import { supabase } from "@/supabase";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/UserContext";
import { useRouter } from "next/router";

export default function Sharing({data}) {

  const {setLoginUserProfile} = useContext(UserContext)
  const [studentLogin, setStudentLogin] = useState(null)

  const router = useRouter()
  const {id} = router.query


  useEffect(()=>{
    if(data){
      if(data.status==9 || data.status == 10 || data.status == 11 || data.status == 12){
        setStudentLogin(data.status)
      }
      setLoginUserProfile(data)
    }
  },[])


  return (
    <HomeLayout>
      <h1 className="text-2xl text-gray-600 font-semibold text-center">
        File Sharing
      </h1>
      <p className="text-center text-red-500 text-xs font-mono">
        strictly prohibited for non-productive use
      </p>

    {data.status == 'teacher'&&<div className="mt-8">
          <TeacherNavigator status={9} id={id}/>
          <TeacherNavigator status={10} id={id}/>
        <TeacherNavigator status={11} id={id}/>
        <TeacherNavigator status={12} id={id}/>
    </div>
    }

     {studentLogin&&<div>
      <Link href={`/sharing/${id}/${studentLogin}/notes_by_teachers/${studentLogin}`}>
          <StudentNavigator
            title={"Notes By Teachers"}
            status={studentLogin}
            description={"You will be provided all notes of all subjects"}
          />
        </Link>
         <Link href={`/sharing/${id}/${studentLogin}/project_submission/${studentLogin}`}>
            <StudentNavigator
            title={"Project Submission"}
            status={studentLogin}
            description={"You can submit project of all subject"}
            />
        </Link>   
      </div>}
    </HomeLayout>
  );
}


export async function getServerSideProps(context){

  const {data} = await supabase.from('profiles').select().eq("id",context.query?.id)
  console.log(data)

  return{
    props:{
      data:data[0]
    }
  }
}