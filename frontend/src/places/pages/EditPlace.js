import React, { useEffect, useState } from "react";


import Input from "../../shared/components/FormElements/Input";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import "./PlaceForm.css";
import { useParams, useHistory } from "react-router-dom";
import { useForm } from "../../shared/hooks/use-form";
import Button from "../../shared/components/FormElements/Button";
import { useHttpHook } from "../../shared/hooks/http-hook";

const NewPlace = () => {
  const placeId = useParams().placeId;
  const history = useHistory();
  const { sendRequest, HttpFeedback } = useHttpHook();
  const [loadedPlace, setLoadedPlace] = useState();
  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    true
  );

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const resData = await sendRequest(
          `http://localhost:5001/api/places/${placeId}`
        );
        setLoadedPlace(resData.place);
        setFormData(
          {
            title: {
              value: resData.place.value,
              isValid: true,
            },
            description: {
              value: resData.place.description,
              isValid: true,
            },
          },
          true
        );
      } catch (error) {}
    };
    fetchPlace();
  }, [placeId, sendRequest, setFormData]);

  const updateFormHandler = async (event) => {
    event.preventDefault();

    try {
      
      await sendRequest(
        `http://localhost:5001/api/places/${placeId}`,
        "PATCH",
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        }),
        {
          'Content-Type': 'application/json'
        }
      );
      history.goBack()
    } catch (error) {}
  };

  return (
    <>
      <HttpFeedback />
      {loadedPlace && (
        <form className="place-form" onSubmit={updateFormHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
            initialValue={loadedPlace.title}
            initialValdity={true}
          />
          <Input
            id="description"
            type="text"
            label="Description"
            validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description."
            onInput={inputHandler}
            initialValue={loadedPlace.description}
            initialValdity={true}
          />
          <Button disabled={!formState.isValid}>Submit the data</Button>
        </form>
      )}
    </>
  );
};

export default NewPlace;
