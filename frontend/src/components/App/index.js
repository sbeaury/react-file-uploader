import React, { useState, useRef, useEffect } from "react";
import FormData from "form-data";
import axios from "axios";
import Dropzone from "../Dropzone";
import ProgressBar from "../ProgressBar";
import image from "../../static/images/image.svg";

const App = () => {
  const [isError, setIsError] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [onLoad, setOnLoad] = useState(false);
  const [isUploadSuccessful, setIsUploadSuccessful] = useState(false);
  const [preview, setPreview] = useState(null);
  const [fileLocation, setFileLocation] = useState("");
  const [isCopySuccess, setIsCopySuccess] = useState("");

  const inputEl = useRef(null);

  useEffect(() => {
    if (selectedFile) {
      const apiRequest = (data) => {
        const promise = new Promise((resolve, reject) => {
          resolve(
            axios({
              method: "post",
              url: process.env.REACT_APP_UPLOAD_API_URL,
              data: data,
              headers: { "Content-Type": "multipart/form-data" },
            })
          );
        });

        promise
          .then((response) => {
            setIsUploadSuccessful(true);
            setOnLoad(false);
            setImagePreview();
            setFileLocation(response.data.fileLocation);
          })
          .catch(
            // Rejected promise
            () => {
              setOnLoad(false);
              setIsError(true);
            }
          );
      };

      const createFormData = () => {
        try {
          if (selectedFile) {
            setOnLoad(true);

            // Creating a FormData object
            let fileData = new FormData();

            // Setting the 'image' field and the selected file
            fileData.append(
              "image",
              selectedFile,
              `${Date.now()}-${selectedFile.name}`
            );
            apiRequest(fileData);
          }
        } catch (error) {
          setOnLoad(false);
          setIsError(true);
        }
      };

      // Set image preview
      const setImagePreview = () => {
        if (selectedFile) {
          const reader = new FileReader();
          reader.onloadend = () => setPreview(reader.result);
          reader.readAsDataURL(selectedFile);
        }
      };

      createFormData();
    }
  }, [selectedFile]);

  const onDrop = (acceptedFile) => {
    setSelectedFile(acceptedFile);
    // createFormData();
  };

  // Handling file selection from input
  const onFileSelected = (e) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (values) => {
    setSelectedFile(values.file);
    // createFormData();
  };

  const handleClickToClipboard = (e) => {
    inputEl.current.select();
    document.execCommand("copy");
    e.target.focus();
    setIsCopySuccess("Copied!");
  };

  return (
    <div className="app">
      {onLoad ? (
        <ProgressBar />
      ) : (
        <div className="card">
          <div className="container">
            <div className="container-title">
              {isError ? (
                <div className="container-error-message">
                  <span className="material-icons">error</span>
                  <h3 className="title">Something went wrong</h3>
                </div>
              ) : isUploadSuccessful ? (
                <div className="container-success-message">
                  <span className="material-icons">check_circle</span>
                  <h3 className="title">Uploaded successfully!</h3>
                </div>
              ) : (
                <h3 className="title">Upload your image</h3>
              )}
            </div>
            {isUploadSuccessful ? (
              <div className="container-result">
                <img src={preview} className="preview-image" alt="preview" />
                <div className="container-url">
                  <input
                    type="text"
                    className="text-url"
                    ref={inputEl}
                    defaultValue={fileLocation}
                  />
                  <button className="btn-copy" onClick={handleClickToClipboard}>
                    {isCopySuccess === "" ? "Copy" : isCopySuccess}
                  </button>
                </div>
              </div>
            ) : (
              <div className="container-dropzone">
                <h4 className="subtitle">File should be Jpeg, Png,...</h4>
                <form onSubmit={handleSubmit}>
                  <Dropzone image={image} onDrop={onDrop} preview={preview} />
                  <div>
                    <h4 className="text-or">Or</h4>
                    <div className="container">
                      {isUploadSuccessful ? null : (
                        <label
                          htmlFor="file-picker"
                          className="btn-file-picker"
                        >
                          <input
                            id="file-picker"
                            type="file"
                            style={{ display: "none" }}
                            onChange={onFileSelected}
                          />
                          Choose a file
                        </label>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
