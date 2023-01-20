import { HomeIcon, BuildingLibraryIcon, UserGroupIcon, BellIcon, ArrowLeftCircleIcon } from '@heroicons/react/24/outline'
import Card from "@/components/Card";
import { supabase } from '@/supabase';
import { useRouter } from 'next/router';

export default function HomeLayout({ children }) {

  const router = useRouter()

  const handleLogout = async() =>{
    const { error } = await supabase.auth.signOut()
    if(error){
      throw error;
    }
    
    router.push('/login')

  }

  return (
    <div className="mt-4 flex mx-auto gap-5 max-w-4xl">
      <div className=" fixed bottom-0 w-screen md:w-3/12 md:static ">
        <Card>
          <div className="px-3 py-5 min-w-[18vw] md:min-h-[60vh]">
            <h1 className="font-bold p-2 text-gray-700 hidden md:block">Navigation</h1>
            <div className="flex content-center justify-evenly md:block ml-2 md:space-y-8 mt-2">
              <div className="flex items-center gap-2">
                
                <HomeIcon className="h-8" /> <span className='hidden md:block'>Home</span>
              </div>
              <div className="flex items-center gap-2">
                {" "}
                <BuildingLibraryIcon className="h-8" />  <span className='hidden md:block'>School</span>
              </div>
              <div className="flex items-center gap-2">
                {" "}
                <UserGroupIcon className="h-8" />  <span className='hidden md:block'>Group</span>
              </div>
              <div className="flex items-center gap-2">
                {" "}
                <BellIcon className="h-8" />  <span className='hidden md:block'>Notice</span>
              </div>
              <div onClick={handleLogout} className="flex items-center gap-2 cursor-pointer">
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
