import { UserContext } from "@/UserContext";
import Image from "next/image";
import React, { useContext, useEffect, useRef, useState } from "react";
import { MutatingDots } from "react-loader-spinner";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

export default function ChatDisplay({ messages, loginUserData, onScroll, scrollRef }) {
 

  return (
    <div
      onScroll={onScroll}
      ref={scrollRef}
      className="relative w-full p-6 overflow-y-auto h-[72vh] md:h-[80vh] "
    >
      <div>
        {messages?.length > 0 &&
          messages.map((message) => (
            <ul key={message.id} className="space-y-2 my-5 ">
              {message.author !== loginUserData?.id && (
                <li className="flex justify-start">
                  <div>
                    <PhotoProvider>
                      {message.images?.length > 0 && (
                        <div
                          className={`relative ${
                            message.images.length == 1 && "flex  justify-end"
                          }  ${
                            message.images.length > 1 &&
                            "grid gap-2 grid-cols-2"
                          } `}
                        >
                          {message.images?.map((imag) => (
                            <PhotoView key={imag} src={imag}>
                              <Image
                                key={imag}
                                alt="image"
                                height={120}
                                className={`mb-2 rounded-md overflow-hidden`}
                                width={100}
                                src={imag}
                              />
                            </PhotoView>
                          ))}
                          {/* author name on photo */}
                          <div>
                            <p className=" opacity-40 px-2 rounded-md text-gray-600 absolute left-0 p-0 -top-1">{`@${message?.author_name}`}</p>
                          </div>
                        </div>
                      )}
                    </PhotoProvider>
                    {message?.content?.length > 0 && (
                      <div>
                        <div className="relative max-w-xl px-4 w-fit py-2 text-gray-700 bg-slate-200 rounded shadow">
                          <div>
                            <span className="text-xs  text- text-gray-600">
                              @{message.author_name}
                            </span>
                            <span className="block">{message.content}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              )}
              {message.author == loginUserData?.id && (
                <li className="flex justify-end">
                  <div>
                    <PhotoProvider>
                      {message.images?.length > 0 && (
                        <div
                          className={`${
                            message.images.length == 1 && "flex  justify-end"
                          } ${
                            message.images.length > 1 &&
                            "grid gap-2 grid-cols-2"
                          } `}
                        >
                          {message.images?.map((imag) => (
                            <PhotoView key={imag} src={imag}>
                              <Image
                                alt="image"
                                height={120}
                                className={`mb-2 rounded-md overflow-hidden`}
                                width={100}
                                src={imag}
                              />
                            </PhotoView>
                          ))}
                        </div>
                      )}
                    </PhotoProvider>
                    {message?.content?.length > 0 && (
                      <div className="flex justify-end">
                        <div className=" w-fit max-w-xl px-4 py-2   text-gray-700 bg-blue-300 rounded shadow">
                          <span className="block">{message.content}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              )}
            </ul>
          ))}
      </div>
    </div>
  );
}
