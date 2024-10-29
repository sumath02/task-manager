import React from "react";
import { ClipLoader } from "react-spinners";

export default function Loader() {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "70vh",
      }}
    >
      <ClipLoader color="rgb(14, 108, 253)" size={50} />
    </div>
  );
}
