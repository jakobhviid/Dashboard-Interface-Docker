import jsonwebtoken from "jsonwebtoken";

export function loadAndTestJwtLocalStorage() {
  try {
    const jwt = localStorage.getItem("jwt");
    if (jwt === null) return undefined;
    const decodedJwt = jsonwebtoken.decode(jwt);
    console.log(decodedJwt);

    return jwt;
  } catch (err) {
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
