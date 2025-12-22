import React from "react";
import LoadingSpinner from "./LoadingSpinner.jsx";

export default function Loader({ text = "", size = "md", className = "py-8" }) {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <LoadingSpinner size={size} text={text} />
    </div>
  );
}
