import Link from "next/link";
import { useRouter } from "next/router";
import Card from "../Card";

export default function TeacherNavigator({ status:classname, id }) {
  const router = useRouter();
  return (
    <div className="my-6">
      <Card>
          <div className="flex py-3 space-x-1 justify-center">
          <button onClick={()=>router.push(`/sharing/${id}/teacher/notes_by_teachers/${classname}`)} className="w-4/12  rounded-md shadow-md bg-gray-100 border border-gray-500 border-r-2">
            <h1>You share a Notes</h1>
          </button>
          <div className="w-2/12  flex justify-center items-center">
              <div className=" flex justify-center items-center text-4xl text-gray-100 bg-gray-500 h-12 w-12 md:h-14 md:w-14 rounded-full">
                {classname}
              </div>
            </div>
            <button onClick={()=>router.push(`/sharing/${id}/teacher/project_submission/${classname}`)} className="w-4/12  rounded-md shadow-md bg-gray-100 border border-gray-500 border-r-2">
            <h1>Project Submission By Students</h1>
          </button>
          </div>

      </Card>
    </div>
  );
}
