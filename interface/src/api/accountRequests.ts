import { LOGIN_ENDPOINT } from "./endpoints";
import { ISuccessfulLoginResponse, IErrorLoginResponse } from "../types/api_response/account.types";

export async function login(email: string, password: string): Promise<string | string[]> {
  try {
    const response: ISuccessfulLoginResponse = await fetch(LOGIN_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    }).then((response) => response.json());
    console.log(response);
    return response.token;
  } catch (error) {
    const errorResponse: IErrorLoginResponse = error;
    return errorResponse.message;
  }
}
