// window.__env__. will be accesible in production, if it is undefined we are in development, and just use 5000 as the port.
const port = window._env_.DASHBOARDI_SOCKET_SERVER_PORT === undefined ? 5000 : window._env_.DASHBOARDI_SOCKET_SERVER_PORT;
export const SOCKET_SERVER_ENDPOINT =
  window._env_.DASHBOARDI_HOST_DNS === undefined ? `http://127.0.0.1:${port}` : `${window._env_.DASHBOARDI_HOST_DNS}:${port}`;
export const SOCKET_SERVER_UPDATES_ENDPOINT = `${SOCKET_SERVER_ENDPOINT}/updates`;
export const LOGIN_ENDPOINT = `${SOCKET_SERVER_ENDPOINT}/account/login`;
