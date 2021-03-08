import fetch from 'isomorphic-unfetch'

let API = process.env.NEXT_PUBLIC_API;
export async function getUsers(url) {
  const real_url = url.replace("perfiles","public-users");
  let data;
  try {
    let res = await fetch(API + real_url, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    });
    data = await res.json();
    return data;
  } catch (error) {
    return [];
  }
}

export async function getUser(id) {
  let data;
  try {
    let res = await fetch(API + "/public-users/"+id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    data = await res.json();
    return data;
  } catch (error) {
    return [];
  }
}