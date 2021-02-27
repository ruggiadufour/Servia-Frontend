import axios from "axios";

export function deleteFile(id, jwt, thenCall, errorCall) {
  const API = process.env.NEXT_PUBLIC_API;

  axios
    .delete(API + "/upload/files/" + id, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
    .then((response) => {
      thenCall()
    })
    .catch((error) => {
      errorCall()
    });
}
