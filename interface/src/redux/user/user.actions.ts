import UserActionTypes from "./user.types";
import {
  stopCollectingOverview,
  stopCollectingRessources,
  stopListeningForCommandResponses,
} from "../container_data/containerData.effects";
import { hubConnectionOff } from "../container_data/containerData.actions";

export const loginWithJwt = (jwt: string) => ({
  type: UserActionTypes.LOGIN,
  payload: jwt,
});

export const removeJwt = () => ({
  type: UserActionTypes.REMOVE_JWT,
});

export const logout = () => {
  return (dispatch: any) => {
    dispatch(removeJwt());
    dispatch(stopCollectingOverview());
    dispatch(stopCollectingRessources());
    dispatch(stopListeningForCommandResponses());
    dispatch(hubConnectionOff())
  };
};
