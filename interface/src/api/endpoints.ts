const port = process.env.DASHBOARDI_SOCKET_SERVER_PORT === undefined ? 5000 : process.env.DASHBOARDI_SOCKET_SERVER_PORT;
export const SOCKET_SERVER_ENDPOINT = `http://127.0.0.1:${port}`
export const SOCKET_SERVER_UPDATES_ENDPOINT = `${SOCKET_SERVER_ENDPOINT}/updates`
export const LOGIN_ENDPOINT = `${SOCKET_SERVER_ENDPOINT}/account/login`;
