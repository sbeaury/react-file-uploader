import React from "react";
import { useDropzone } from "react-dropzone";

const Dropzone = ({ isError, preview, image, onDrop, ...props }) => {
  const { getRootProps, getInputProps, isDragReject } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFile) => {
      onDrop(acceptedFile[0]);
    },
  });
  return (
    <div {...getRootProps({ className: "dropzone" })}>
      <img className="image" src={image} alt="dropzone" />
      {isError ? (
        <h4>Something went wrong...</h4>
      ) : (
        !preview && (
          <h4 className="dropzone-message">
            {isDragReject
              ? "File type not accepted, sorry!"
              : "Drag and drop your image here"}
          </h4>
        )
      )}
      <input {...getInputProps()} />
    </div>
  );
};

export default Dropzone;
