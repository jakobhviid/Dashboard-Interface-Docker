import { Console } from "console";
import jsonwebtoken from "jsonwebtoken";

export function loadAndTestJwtLocalStorage() {
  try {
    const jwt = localStorage.getItem("jwt");
    if (jwt === null) return undefined;
    const decodedJwt: any = jsonwebtoken.decode(jwt);
    console.log(decodedJwt.exp);
    if (Date.now() > decodedJwt.exp * 1000) {
      // The token is expired
      // Remove jwt so the user has to log in again
      removeJwtLocalStorage();
      return undefined;
    }

    return jwt;
  } catch (err) {
    console.log(err);
    console.log("triggered catch in jswowebtoken, reduxHelpers.");
    return undefined;
  }
}

export function saveJwtLocalStorage(jwt: string) {
  try {
    localStorage.setItem("jwt", jwt);
  } catch {
    // Don't write
  }
}

export function removeJwtLocalStorage() {
  try {
    localStorage.removeItem("jwt");
  } catch {
    // Do nothing
  }
}
