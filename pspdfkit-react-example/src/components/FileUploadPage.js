import React, { useState } from "react";

function FileUploadPage() {
  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsFilePicked(true); // Fix the variable name here
  };

  const handleSubmission = () => {
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append(
      "temp_folder_path",
      "/Users/Study-Material/Project/pspdfkit-react-example/public/stored-file/"
    );

    fetch("http://127.0.0.1:5004/UploadFile", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.result) {
          alert(result.message);
        } else {
          alert(result.message);
        }

        //   console.log('Success:', result);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div>
      <div className="custom-file">
        <input
          type="file"
          name="file"
          onChange={changeHandler}
          className="custom-file-input"
          id="customFile"
        />
      </div>

      {isFilePicked ? (
        <div>
          <p>Filename: {selectedFile.name}</p>
        </div>
      ) : (
        <></>
      )}

      <br></br>

      <div>
        <button className="btn btn-primary" onClick={handleSubmission}>
          Submit
        </button>
      </div>
    </div>
  );
}

export default FileUploadPage;
