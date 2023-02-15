import {
  HomeIcon,
  UserGroupIcon,
  BellIcon,
  ArrowLeftCircleIcon,
  UserPlusIcon,
  CalendarIcon,
  FolderMinusIcon,
} from "@heroicons/react/24/outline";
import Card from "@/components/Card";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useContext, useEffect } from "react";
import { UserContext } from "@/UserContext";

const onSelectedStyle = "bg-blue-400 rounded-md text-white -mx-4 px-4 py-1";
const onHover =
  " hover:-mx-6 hover:px-6 hover:bg-blue-200 hover:rounded-md hover:overflow-hidden   md:py-2";

export default function HomeLayout({ children, hidden=false }) {
  const router = useRouter();

  const { asPath } = router;

  const { status, pathname } = router;


  const HomeSelected = asPath == "/";
  const GroupSelected = asPath == "/messaging";


  const { loginUserId, setLoginUserId,postScroll } = useContext(UserContext);

  const supabase = useSupabaseClient();
  const session = useSession();

  useEffect(() => {
    if (!loginUserId) {
      setLoginUserId(session?.user);
    }
  });

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
    console.log(error);

    router.push("/login");
  };


  return (
    <div
      className={`mt-1  flex  gap-5 max-w-full`} 
    >
      <div className={` fixed ${hidden && 'hidden md:block'} opacity-100 bottom-0 w-screen md:w-2/12 md:fixed md:top-1 md:left-0 `}>
        <Card>
          <div className="bg-[#ffffff] md:px-4 py-2 md:py-8 min-w-[18vw] md:min-h-[60vh]">
            <h1 className="font-bold text-xl p-2 text-gray-700 hidden md:block">
              Janata Mavi
            </h1>
            <div className="flex  content-center justify-evenly md:block ml-2 md:space-y-8 mt-2">
              <Link
                href={"/"}
                className={`${
                  HomeSelected && onSelectedStyle
                } ${onHover} flex  items-center gap-2`}
              >
                <HomeIcon className="h-8" />{" "}
                <span className="hidden md:block">Home</span>
              </Link>
              <Link
                href={`/sharing/${loginUserId?.id}`}
                className={`flex cursor-pointer items-center gap-2 ${onHover}`}
              >
                {" "}
                <FolderMinusIcon className="h-8" />{" "}
                <span className="hidden md:block">Project</span>
              </Link>
              <Link
                href={`/messages/${loginUserId?.id}`}
                className={` ${
                  GroupSelected && onSelectedStyle
                } ${onHover} flex items-center gap-2`}
              >
                {" "}
                <UserGroupIcon className="h-8" />{" "}
                <span className="hidden md:block">Group</span>
              </Link>
              
              {loginUserId?.id == "470505ee-5319-441e-9185-34a0eaa2027e" && (
                <Link
                  href={"https://school-media-lwy4.vercel.app/"}
                  target="_blank"
                  className={`flex cursor-pointer items-center gap-2 ${onHover}`}
                >
                  {" "}
                  <UserPlusIcon className="h-8" />{" "}
                  <span className="hidden md:block">New User</span>
                </Link>
              )}
              <div
                onClick={handleLogout}
                className={`${onHover} flex items-center gap-2 cursor-pointer`}
              >
                {" "}
                <ArrowLeftCircleIcon className="h-8 " />{" "}
                <span className="hidden md:block">Logout</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <div className={` md:ml-32 grow flex justify-center md:w-12/12 `}  >
      <div className={`  ${pathname == '/sharing/[id]/[status]/notes_by_teachers/[room]' || pathname == '/sharing/[id]/[status]/project_submission/[room]' || pathname == '/messages/[id]/[status]' ? 'md:w-8/12' : 'md:w-6/12'}  `}>{children}</div>
      </div>
    </div>
  );
}
