let API = process.env.NEXT_PUBLIC_API;
import axios from 'axios'

import fetch from "isomorphic-unfetch";

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
    let res = await fetch(API + "/publications/" + id, {
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

export async function createPublication(publication, images, jwt) {
  const formData = new FormData();

  for (let i = 0; i < images.length; i++) {
    formData.append("files.images", images[i]);
  }

  formData.append("data", JSON.stringify({ ...publication }));  

  let data = null, error = null;
  try {
    let res = await axios.post(API + "/create-publication", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `bearer ${jwt}`,
      },
    })
    data = res.data;

    return {data: data, error:error}
  } catch (error) {
    console.log(error.response)
    return {data: data, error:error.response}
  }  
}

export async function modifyPublication(id, publication, images, jwt) {
  const formData = new FormData();

  for (let i = 0; i < images.length; i++) {
    formData.append("files.images", images[i]);
  }

  formData.append("data", JSON.stringify({ ...publication }));  

  let data = null, error = null;
  try {
    let res = await axios.put(API + "/publications/"+id, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `bearer ${jwt}`,
      },
    })
    data = res.data;

    return {data: data, error:error}
  } catch (error) {
    console.log(error.response)
    return {data: data, error:error.response}
  }  
}

export async function deletePublication(id, jwt) {
  let data = null, error = null;
  try {
    let res = await axios.delete(API + "/publications/"+id, {
      headers: {
        Authorization: `bearer ${jwt}`,
      },
    })
    data = res.data;
    
    return {data: data, error:error}
  } catch (error) {
    console.log(error.response)
    return {data: data, error:error.response}
  }  
}
