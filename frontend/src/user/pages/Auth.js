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
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Button from "../../shared/components/FormElements/Button";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpHook } from "../../shared/hooks/http-hook";

const Auth = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpHook();
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
        await sendRequest(
          "http://localhost:5001/api/users/signup",
          "POST",

          JSON.stringify({
            name: formState.inputs.name.value,
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        auth.login();
      } catch (error) {}
    } else {
      try {
        await sendRequest(
          "http://localhost:5001/api/users/login",
          "POST",

          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        auth.login();
      } catch (error) {}
    }
  };

  return (
    <React.Fragment>
      {error && <ErrorModal onClear={clearError} error={error} />}
      {isLoading && (
        <div className="center">
          <LoadingSpinner show={isLoading} asOverlay />
        </div>
      )}
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
