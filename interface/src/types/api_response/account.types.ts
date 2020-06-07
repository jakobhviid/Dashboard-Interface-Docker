export interface ISuccessfulLoginResponse {
  token: string;
  statusCode: 200;
  message: string;
}
export interface IErrorLoginResponse {
  statusCode: number;
  message: string[];
}
