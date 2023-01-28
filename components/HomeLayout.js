import { HomeIcon, BuildingLibraryIcon, UserGroupIcon, BellIcon, ArrowLeftCircleIcon, UserPlusIcon } from '@heroicons/react/24/outline'
import Card from "@/components/Card";
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useContext, useEffect } from 'react';
import { UserContext } from '@/UserContext';

  
const onSelectedStyle = "bg-blue-400 rounded-md text-white -mx-4 px-4 py-1"
const onHover = " hover:-mx-6 hover:px-6 hover:bg-blue-200 hover:rounded-md hover:overflow-hidden   md:py-2"


export default function HomeLayout({ children }) {

  const router = useRouter()

  const {asPath} = router

  const {status,pathname} = router.query
  
  const HomeSelected = asPath == "/"
  const GroupSelected  =  asPath == "/messaging"

  const {loginUserId,setLoginUserId} = useContext(UserContext)

  const supabase = useSupabaseClient();
  const session = useSession()

  useEffect(()=>{
    if(!loginUserId){
      setLoginUserId(session?.user)
    }
  })

  const handleLogout = async() =>{

    const { error } = await supabase.auth.signOut()
    if(error){
      throw error;
    }
    console.log(error)
    
    router.push('/login')

  }

  return (
    <div className="mt-4 flex mx-auto gap-5 max-w-4xl">
      <div className=" fixed bottom-0 w-screen md:w-3/12 md:static">
        <Card>
          <div className="px-3 py-2 md:py-2 min-w-[18vw] md:min-h-[60vh]">
            <h1 className="font-bold p-2 text-gray-700 hidden md:block">Navigation</h1>
            <div className="flex  content-center justify-evenly md:block ml-2 md:space-y-8 mt-2">
              <Link href={'/'} className={`${HomeSelected && onSelectedStyle} ${onHover} flex  items-center gap-2`}>
                
                <HomeIcon className="h-8" /> <span className='hidden md:block'>Home</span>
              </Link>
              <div className={`flex cursor-pointer items-center gap-2 ${onHover}`}>
                {" "}
                <BuildingLibraryIcon className="h-8" />  <span className='hidden md:block'>School</span>
              </div>
              <Link href={`/messages/${loginUserId?.id}`} className={` ${GroupSelected && onSelectedStyle} ${onHover} flex items-center gap-2`}>
                {" "}
                <UserGroupIcon className="h-8" />  <span className='hidden md:block'>Group</span>
              </Link>
              <Link href={"https://school-media-lwy4.vercel.app/"} target="_blank" className={`flex cursor-pointer items-center gap-2 ${onHover}`}>
                {" "}
                <UserPlusIcon className="h-8" />  <span className='hidden md:block'>New User</span>
              </Link>
              <div onClick={handleLogout} className={`${onHover} flex items-center gap-2 cursor-pointer`}>
                {" "}
                <ArrowLeftCircleIcon   className="h-8 " />  <span className='hidden md:block'>Logout</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <div className=" md:9/12 grow">
        {children}
      </div>
    </div>
  );
}
