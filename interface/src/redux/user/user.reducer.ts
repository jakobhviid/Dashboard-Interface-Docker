import UserActionTypes from "./user.types";
import { IUserState, ReducerAction } from "../../types/redux/reducerStates.types";
import produce from "immer";
import { saveJwtLocalStorage, removeJwtLocalStorage } from "../../util/reduxHelpers";

const INTIAL_STATE: IUserState = {
  jwt: undefined,
  displayName: "",
};

const userReducer = (state = INTIAL_STATE, action: ReducerAction) => {
  switch (action.type) {
    case UserActionTypes.LOGIN:
      console.log(action.payload)
      const parsedJwt = parseJwt(action.payload.jwt);
      return produce(state, (nextstate) => {
        Object.keys(parsedJwt).forEach((key) => {
          if (key.includes("emailaddress")) {
            let email: string = parsedJwt[key];
            nextstate.displayName = email.substring(0, email.indexOf("@"));
          }
        });
        nextstate.jwt = action.payload.jwt;
        if (action.payload.saveJwt)
          saveJwtLocalStorage(action.payload.jwt);
      });
    case UserActionTypes.REMOVE_JWT:
      return produce(state, (nextstate) => {
        removeJwtLocalStorage();
        nextstate.jwt = undefined;
        nextstate.displayName = "";
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
