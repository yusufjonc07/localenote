import React, { useEffect, useRef, useState } from "react";

import "./ImageUpload.css";
import Button from "./Button";
import AvatarEditor from "react-avatar-editor";
import extractDominantColor from "../../util/dominant-color-extractor";

const ImageUpload = (props) => {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);

  const [color, setColor] = useState();
  const [scale, setScale] = useState(1.2);

  const filePickerRef = useRef();
  const editorRef = useRef();

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const pickerHandler = (event) => {
    let pickedFile;
    let fileIsValid = isValid;

    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = true;
    }
    props.onInput(props.id, pickedFile, fileIsValid);
  };

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  const handlePositionChange = () => {
    if (editorRef.current) {
      const canvas = editorRef.current.getImageScaledToCanvas();
      canvas.toBlob(
        (blob) => {
          const croppedFile = new File([blob], file.name, {
            type: file.type,
          });

          props.onInput(props.id, croppedFile, true);
        },
        file.type || "image/jpeg",
        1
      );
    }
  };

  const backgroundColorHandler = () => {
    extractDominantColor(previewUrl, (colors) => {
      setColor(colors);
    });
  };

  const zoomInHandler = () => {
    setScale((prevScale) => (prevScale += 0.2));
  };
  const zoomOutHandler = () => {
    setScale((prevScale) => (prevScale -= 0.2));
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
          {previewUrl ? (
            <AvatarEditor
            className="image-upload__preview"
              ref={editorRef}
              image={previewUrl}
              width={100}
              height={100}
              border={50}
              color={color || [255, 255, 255, 0.6]} // RGBA
              scale={scale}
              rotate={0}
              onPositionChange={handlePositionChange}
              onImageReady={backgroundColorHandler}
            />
          ) : (
            <div className="image-upload__preview">
              <p>Please choose an image</p>
            </div>
          )}

          <div style={{ display: "flex" }}>
            <Button type="button" onClick={pickImageHandler}>
              {previewUrl ? "CHANGE" : "PICK"}
            </Button>

            {previewUrl && (
              <div className="button-group">
                <Button type="button" onClick={zoomInHandler}>
                  +
                </Button>
                <Button type="button" onClick={zoomOutHandler}>
                  -
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
