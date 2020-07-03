import UserActionTypes from "./user.types";
import {
  stopCollectingOverview,
  stopCollectingRessources,
  stopListeningForCommandResponses,
} from "../container_data/containerData.effects";
import { hubConnectionOff } from "../container_data/containerData.actions";
import { HubConnection } from "@microsoft/signalr";

export const loginWithJwt = (jwt: string, saveJwt: boolean) => ({
  type: UserActionTypes.LOGIN,
  payload: {jwt, saveJwt},
});

export const removeJwt = () => ({
  type: UserActionTypes.REMOVE_JWT,
});

export const logout = () => {
  return (dispatch: any, getState: any) => {
    const socketConnection: HubConnection = getState().containerData.socketConnection;
    dispatch(removeJwt());
    if (socketConnection !== undefined) {
      dispatch(stopCollectingOverview());
      dispatch(stopCollectingRessources());
      dispatch(stopListeningForCommandResponses());
      dispatch(hubConnectionOff());
    }
  };
};
