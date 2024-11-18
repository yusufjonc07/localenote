import React, { useContext, useState } from "react";

import { useForm } from "../../shared/hooks/use-form";
import Input from "../../shared/components/FormElements/Input";
import "./Auth.css";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";

import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpHook } from "../../shared/hooks/http-hook";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

const Auth = () => {
  const { sendRequest, HttpFeedback } = useHttpHook();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const auth = useContext(AuthContext);
  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const switchIsLoginMode = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
          image: {
            value: null,
            isValid: false,
          },
        },
        false
      );
    }

    setIsLoginMode((prevState) => !prevState);
  };

  const submitFormDataHandler = async (e) => {
    e.preventDefault();

    if (!isLoginMode) {
      try {
        const formData = new FormData();
        formData.append("name", formState.inputs.name.value);
        formData.append("email", formState.inputs.email.value);
        formData.append("password", formState.inputs.password.value);
        formData.append("image", formState.inputs.image.value);

        const resData = await sendRequest(
          process.env.BACKEND_API_URL + "users/signup",
          "POST",
          formData,
        );
        auth.login(resData.userId, resData.token);
      } catch (error) {}
    } else {
      try {
        const resData = await sendRequest(
          process.env.BACKEND_API_URL + "users/login",
          "POST",

          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        auth.login(resData.userId, resData.token);
      } catch (error) {}
    }
  };

  return (
    <React.Fragment>
      <HttpFeedback />
      <Card className="authentication">
        <h1 className="authentication__header">Login required</h1>
        <hr />
        <form onSubmit={submitFormDataHandler}>
          {!isLoginMode && (
            <Input
              element="input"
              id="name"
              label="Your name"
              placeholder="Enter your name"
              onInput={inputHandler}
              errorText="Please provide a name"
              validators={[VALIDATOR_REQUIRE()]}
            />
          )}
          {!isLoginMode && (
            <ImageUpload id="image" is center onInput={inputHandler} />
          )}

          <Input
            element="input"
            id="email"
            type="email"
            label="Email"
            placeholder="Enter your email"
            onInput={inputHandler}
            errorText="Please provide valid email"
            validators={[VALIDATOR_EMAIL(), VALIDATOR_REQUIRE()]}
          />
          <Input
            element="input"
            id="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            onInput={inputHandler}
            errorText="Please provide correct password"
            validators={[VALIDATOR_MINLENGTH(5), VALIDATOR_REQUIRE()]}
          />
          <Button disabled={!formState.isValid}>
            {isLoginMode ? "LOGIN" : "SIGNUP"}
          </Button>
          <Button type="button" onClick={switchIsLoginMode}>
            SWITCH TO {!isLoginMode ? "LOGIN" : "SIGNUP"}
          </Button>
        </form>
      </Card>
    </React.Fragment>
  );
};

export default Auth;
