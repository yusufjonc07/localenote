import React, { useContext } from "react";
import {useCurrentPosition} from "react-use-geolocation"
import { useForm } from "../../shared/hooks/use-form";

import Input from "../../shared/components/FormElements/Input";
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
  const history = useHistory()
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: "",
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
      await sendRequest(
        "http://localhost:5001/api/places",
        "POST",
        JSON.stringify({
          title: formState.inputs.title.value,
          address: formState.inputs.address.value,
          description: formState.inputs.description.value,
          creator: auth.userId,
          location: {
            lat: position.coords.latitude,
            long: position.coords.longitude,
          }
        }),
        {
          "Content-Type": "application/json",
        }
      );
      history.push('/')
    } catch (error) {}
  };

  return (
    <>
      <HttpFeedback />
      <form className="place-form" onSubmit={placeSubmitHandler}>
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
