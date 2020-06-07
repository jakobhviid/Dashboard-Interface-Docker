import UserActionTypes from "./user.types";

export const loginWithJwt = (jwt: string) => ({
  type: UserActionTypes.LOGIN,
  payload: jwt,
});