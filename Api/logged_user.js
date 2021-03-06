const API = process.env.NEXT_PUBLIC_API;
import axios from 'axios'
import useSWR from "swr";

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

export function useToVerify(jwt) {
  const fetchReports = (...args) =>
    fetch(...args, {
      headers: {
        "Authorization": `bearer ${jwt}`,
      },
    }).then((res) => res.json());

  const { data, error } = useSWR(API + "/users?waiting_verification=true", fetchReports,{ refreshInterval: 5000 });

  return {
    usersToVerify: data,
    isLoading: !error && !data,
    isError: error,
  };
}