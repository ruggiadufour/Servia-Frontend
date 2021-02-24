import fetch from 'isomorphic-unfetch'

export async function getCategories() {
  let data = [];
  let API = process.env.NEXT_PUBLIC_API
  try{
    let res = await fetch(API + "/categories",{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    });
    data = await res.json();

    return data;
  }catch(error){
    return []
  }  
}
