import UserActionTypes from "./user.types";
import { IUserState, ReducerAction } from "../../types/redux/reducerStates.types";
import produce from "immer";

const INTIAL_STATE: IUserState = {
  jwt: undefined,
  displayName: ""
};

const userReducer = (state = INTIAL_STATE, action: ReducerAction) => {
  switch (action.type) {
    case UserActionTypes.LOGIN:
      return produce(state, (nextstate) => {
        nextstate.jwt = action.payload;
      });
    default:
      return state;
  }
};

export default userReducer;
