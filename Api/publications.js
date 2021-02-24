let API = process.env.NEXT_PUBLIC_API;

import fetch from 'isomorphic-unfetch'

export async function getPublications(query) {
  let data;
  try {
    let res = await fetch(API + "/publications", {
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

export async function getPublication(id) {
  let data;
  try {
    let res = await fetch(API + "/publications/"+id, {
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

