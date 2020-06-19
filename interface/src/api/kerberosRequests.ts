export interface IDownloadKeyTabBody {
  username: string;
  password: string;
  host?: string;
}

export async function downloadKeytab(kerberosUrl: string, postBody: IDownloadKeyTabBody) {
  var kerberosKeytab = fetch(kerberosUrl + "/get-keytab", {
    method: "post",
    body: JSON.stringify(postBody),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.status === 400) {
        throw "Invalid Credentials";
      } else if (response.status === 404) {
        throw "Invalid URL";
      }
      return response.blob();
    })
    .catch((error) => {
      throw error;
    });
  return kerberosKeytab;
}
