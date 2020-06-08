import { LOGIN_ENDPOINT } from "./endpoints";
import { ISuccessfulLoginResponse, IErrorLoginResponse } from "../types/api_response/account.types";

export async function login(email: string, password: string) {
  const response = await fetch(LOGIN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  }).then((response) => response.json());
  if (response.statusCode >= 400 && response.statusCode < 500) {
    const errorResponse: IErrorLoginResponse = response;
    if (Array.isArray(errorResponse.message)) throw new Error(errorResponse.message[0]);
    else throw new Error(errorResponse.message);
  } else {
    const successResponse: ISuccessfulLoginResponse = response;
    return response.token;
  }
}
