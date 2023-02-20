import React, { useState, useEffect, useReducer, useContext,useRef } from "react";
import AuthContext from "../../context/auth-context";
import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";
import Input from "../Input/Input";
import './Login.module.css'

const passwordReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    return { value: action.val, isValid: action.val.trim().length > 6 };
  }
  if (action.type === "INPUT_BLUR") {
    return { value: state.value, isValid: state.value.trim().length > 6 };
  }
  return { value: "", isValid: false };
};

const emailReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    return { value: action.val, isValid: action.val.includes("@") };
  }
  if (action.type === "INPUT_BLUR") {
    return { value: state.value, isValid: state.value.includes("@") };
  }
  return { value: "", isValid: false };
};
const Login = (props) => {
  // const [enteredEmail, setEnteredEmail] = useState('');
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState('');
  // const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: "",
    isValid: false,
  });
  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: "",
    isValid: false,
  });
  const ctx = useContext(AuthContext);
  const emailRefInput = useRef();
  const passwordRefInput = useRef();

  const { isValid: EmailIsValid } = emailState;
  const { isValid: passwordIsValid } = passwordState;

  useEffect(() => {
    const identifier = setTimeout(() => {
      console.log("Checking form validity!");
      setFormIsValid(EmailIsValid && passwordIsValid);
    }, 500);
    return () => {
      console.log("Cleaning Up");
      clearInterval(identifier);
    };
  }, [EmailIsValid, passwordIsValid]);

  const emailChangeHandler = (event) => {
    dispatchEmail({ type: "USER_INPUT", val: event.target.value });

    //  setFormIsValid(
    //   emailState.isValid && passwordState.isValid
    // )
  };

  const passwordChangeHandler = (event) => {
    dispatchPassword({ type: "USER_INPUT", val: event.target.value });

    // setFormIsValid(
    //   emailState.isValid && passwordState.isValid
    // )
  };

  const validateEmailHandler = () => {
    dispatchEmail({ type: "INPUT_BLUR" });
  };

  const validatePasswordHandler = () => {
    dispatchPassword({ type: "INPUT_BLUR" });
  };

  const submitHandler = (event) => {
    if(EmailIsValid){
      ctx.onLogin(emailState.value, passwordState.value);
    }
    else if(!EmailIsValid){
    emailRefInput.current.focus()
    }
    else{
      passwordRefInput.current.focus()
    }
    event.preventDefault();
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input
         id ="email" label ="E-Mail" type ="email" isValid = {EmailIsValid} value = {emailState.value} onChange = {emailChangeHandler} onBlur = {validateEmailHandler} ref ={emailRefInput}
        />

      <Input
      ref = {passwordRefInput}   id ="password" label ="Password" type ="password" isValid = {passwordIsValid} value = {passwordState.value} onChange = {passwordChangeHandler} onBlur = {validatePasswordHandler}
        />
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} >
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
