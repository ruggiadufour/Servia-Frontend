import axios from "axios";
const API = process.env.NEXT_PUBLIC_API;

export async function getChats(id, jwt) {
  let data, error;
  try {
    let res = await axios.get(
      API + "/chats/"+id,
      {
        headers: {
          Authorization: `bearer ${jwt}`,
        },
      }
    );
    data = res.data;

    return { data: data, error: error };
  } catch (error) {
    return { data: data, error: error.response };
  }
}
