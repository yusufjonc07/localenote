import React, { useContext } from "react";
import { useCurrentPosition } from "react-use-geolocation";
import { useForm } from "../../shared/hooks/use-form";

import Input from "../../shared/components/FormElements/Input";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import "./PlaceForm.css";
import Button from "../../shared/components/FormElements/Button";
import { useHttpHook } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { useHistory } from "react-router-dom";

const NewPlace = () => {
  const auth = useContext(AuthContext);
  const { sendRequest, HttpFeedback } = useHttpHook();
  const [position] = useCurrentPosition();
  const history = useHistory();
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      image: {
        value: null,
        isValid: false,
      },
      address: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const placeSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", formState.inputs.title.value);
      formData.append("address", formState.inputs.address.value);
      formData.append("description", formState.inputs.description.value);
      formData.append("creator", auth.userId);
      formData.append("image", formState.inputs.image.value);
      formData.append(
        "location",
        JSON.stringify({
          lat: position.coords.latitude,
          long: position.coords.longitude,
        })
      );

      await sendRequest("http://localhost:5001/api/places", "POST", formData, {
        Authorization: "Bearer " + auth.token,
      });
      history.push("/");
    } catch (error) {}
  };

  return (
    <>
      <HttpFeedback />
      <form className="place-form" onSubmit={placeSubmitHandler}>
        <ImageUpload id="image" onInput={inputHandler} />
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputHandler}
        />
        <Input
          id="address"
          type="text"
          label="Address"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid address."
          onInput={inputHandler}
        />
        <Input
          id="description"
          type="text"
          label="Description"
          validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description."
          onInput={inputHandler}
        />
        <Button disabled={!formState.isValid}>Submit the data</Button>
      </form>
    </>
  );
};

export default NewPlace;
