import fetch from 'isomorphic-unfetch'

let API = process.env.NEXT_PUBLIC_API;
export async function getUsers(query) {
  let data;
  try {
    let res = await fetch(API + "/public-users", {
      method: "POST",
      body: JSON.stringify(query),
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