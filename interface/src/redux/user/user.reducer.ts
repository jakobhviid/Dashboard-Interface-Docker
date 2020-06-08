import UserActionTypes from "./user.types";
import { IUserState, ReducerAction } from "../../types/redux/reducerStates.types";
import produce from "immer";
import { saveJwtLocalStorage, loadAndTestJwtLocalStorage } from "../../util/reduxHelpers";

const INTIAL_STATE: IUserState = {
  jwt: undefined,
  displayName: "",
};

const userReducer = (state = INTIAL_STATE, action: ReducerAction) => {
  switch (action.type) {
    case UserActionTypes.LOGIN:
      const parsedJwt = parseJwt(action.payload);
      return produce(state, (nextstate) => {
        Object.keys(parsedJwt).forEach((key) => {
          if (key.includes("emailaddress")) {
            let email: string = parsedJwt[key];
            nextstate.displayName = email.substring(0, email.indexOf("@"));
          }
        });
        nextstate.jwt = action.payload;
        saveJwtLocalStorage(action.payload)
      });
    default:
      return state;
  }
};

function parseJwt(token: string) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

export default userReducer;
