import Image from "next/image";
import React from "react";
import Card from "./Card";

function ShowAllGroup({classNumber,status,desc}) {
  return (
    <div className="my-4 rounded-md">
      <Card>
        <div className="flex p-1 gap-4">
      
          <div className="h-16 font-semibold text-gray-700 text-3xl w-16 rounded-full flex items-center justify-center bg-gray-300">
            {classNumber}
          </div>
          <div className="bg-gray-100 rounded-sm grow content-center">
            <h1 className="text-xl font-semibold ml-1 ">{`Class ${status}`}</h1>
            <p className="font-sans text-gray-700 ml-1">
             {desc}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ShowAllGroup;