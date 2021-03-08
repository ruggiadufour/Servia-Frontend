import axios from 'axios'
const API = process.env.NEXT_PUBLIC_API
export async function setRead(jwt) {
  
  let data = null,
    error = null;

  try {
    let res = await axios.get(API + "/readall", {
      headers: {
        "Authorization": `bearer ${jwt}`,
      },
    });
    data = res.data;

    return { data: data, error: error };
  } catch (error) {
    console.log(error.response);
    return { data: data, error: error.response };
  }
}

export async function deleteNotification(id,jwt) {
  
  let data = null,
    error = null;

  try {
    let res = await axios.delete(API + "/notifications/"+id, {
      headers: {
        "Authorization": `bearer ${jwt}`,
      },
    });
    data = res.data;

    return { data: data, error: error };
  } catch (error) {
    console.log(error.response);
    return { data: data, error: error.response };
  }
}

export function getTypeIcon(type) {
  switch (type) {
    case 0:
      return "📋";
      break;
    case 1:
      return "🆔";
      break;
    case 2:
      return "🤝";
      break;

    default:
      return "🤷‍♂️";
      break;
  }
}