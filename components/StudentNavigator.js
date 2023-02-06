import Card from "./Card";

export default function StudentNavigator({
  title,
  status: classname,
  description,
}) {
  return (
    <div className="rounded-md my-5 mx-2">
      <Card>
        <div className="flex py-3">
          <div className="w-2/12  flex justify-center items-center">
            <div className=" flex justify-center items-center text-4xl text-gray-100 bg-gray-500 h-12 w-12 md:h-14 md:w-14 rounded-full">
              {classname}
            </div>
          </div>
          <div className="10/12">
            <h1 className="text-xl">{title}</h1>
            <p className="text-xs md:text-sm">{description}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
