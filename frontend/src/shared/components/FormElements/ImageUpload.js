import React, { useRef } from "react";

import "./ImageUpload.css";
import Button from "./Button";

const ImageUpload = (props) => {
  const filePickerRef = useRef();

  const pickerHandler = (event) => {
    console.log(event.target);
  };

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  return (
    <div className="form-control">
      <input
        id={props.id}
        type="file"
        ref={filePickerRef}
        style={{ display: "none" }}
        accept=".jpg,.png,.jpeg"
        onChange={pickerHandler}
      />
      <div className={`image-upload ${props.center && "center"}`}>
        <div className={`image-upload ${props.center && "center"}`}>
          <div className="image-upload__preview">
            <img src="" alt="Preview" />
          </div>
          <Button type="button" onClick={pickImageHandler}>
            PICK IMAGE
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;