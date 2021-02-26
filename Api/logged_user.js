const API = process.env.NEXT_PUBLIC_API;
import axios from 'axios'

export async function getLoggedUser(jwt,id){
    let response = null
    try{
        let res = await axios
        .get(API + "/users/" + id,{
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${jwt}`,
          },
        })
        response = res.data
    }catch(error){

    }
    return response
}