import { EllipsisHorizontalIcon, PlusIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import React, { useState } from "react";
import ClickOutHandler from "react-clickout-handler";
import Card from "../Card";
import useDownloader from "react-use-downloader";
import {
  getMaterialFileIcon,
  getMaterialFolderIcon,
  getVSIFileIcon,
  getVSIFolderIcon,
} from "file-extension-icon-js";

function ShowSharingList({ file_name,file_url,profiles,subject }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [fileIconClass, setFileIconClass] = useState("");


  const { size, elapsed, percentage, download, cancel, error, isInProgress } =  useDownloader();


  function handleFileDownload() {
    if (file_url.length > 1) {
      // const splitName = file_url[0].split("/");
      // const filename = splitName[splitName.length - 1];
      for (const file of file_url) {
        download(file, file);
      }
    } else {
      download(file_url[0], filename);
    }
  }
  const splitName = file_url[0]?.split("/");
  const filename = splitName?.[splitName?.length - 1];
  
  if(!filename) return

  return (
    <Card>
      <div className="">
        <div className={`py-4 px-3 relative `}>
          <div className=" w-40">
            <div className={`mt-1 flex items-center `}>
              <Image
                src={`${getMaterialFileIcon(filename)}`}
                alt="js"
                height={66}
                width="60"
              />

              {file_url.length > 1 && (
                <div className="flex bg-blue-200 text-gray-900 rounded-full h-12 w-12 items-center">
                  {" "}
                  <PlusIcon className="h-6" />
                  <h1 className="text-2xl">{file_url.length - 1}</h1>
                </div>
              )}
              <div className="absolute right-0 top-0">
                {showDropdown && <EllipsisHorizontalIcon className="h-6" />}
                {!showDropdown && (
                  <EllipsisHorizontalIcon
                    className="h-6 "
                    onClick={() => setShowDropdown(true)}
                  />
                )}
                {showDropdown && (
                  <ClickOutHandler onClickOut={() => setShowDropdown(false)}>
                    <div className="modal absolute right-0">
                      <Card>
                        <div className="bg-slate-200">
                          <button onClick={handleFileDownload}>Download</button>
                        </div>
                      </Card>
                    </div>
                  </ClickOutHandler>
                )}
              </div>
            </div>
                <p className="text-xs text-gray-400">@{profiles.name}</p>
                <p className="text-lg">{file_name}</p>
          </div>
              <div className="text-gray-500 top-0 left-0">{subject}</div>
        </div>
      </div>
    </Card>
  );
}

export default ShowSharingList;
