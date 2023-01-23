import React, { useEffect, useRef } from "react";

const AlwaysScrollToBottom = () => {
  const elementRef = useRef();
  console.log(elementRef)
  useEffect(() => elementRef.current.scrollIntoView());
  return <div ref={elementRef} />;
};

export default AlwaysScrollToBottom;
