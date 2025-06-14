// ${BASE_URL}


import { BASE_URL } from "../../Config/api";
import { SIGN_IN, SIGN_UP, SIGN_OUT } from "./ActionType";

export const signinAction = (data) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_URL}/signin`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + btoa(data.email + ":" + data.password),
      },
    });
    const token = res.headers.get("Authorization");

    localStorage.setItem("token", token);
    console.log("token from header :- ", token);
    dispatch({type:SIGN_IN,payload:token})
  } catch (error) {
    console.log("catch error ", error);
  }
};

export const signupAction = (data) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const user = await res.json();
    console.log("Signup :- ",user)
    dispatch({ type: SIGN_UP, payload: user });
  } catch (error) {
    console.log("catch error ", error);
  }
};

export const signoutAction = () => (dispatch) => {
    dispatch({ type: SIGN_OUT });
};
