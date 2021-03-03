import fetch from "isomorphic-unfetch";
import axios from "axios";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

import useSWR from "swr";

const API = process.env.NEXT_PUBLIC_API;
export function useMotives(type) {
  const { data, error } = useSWR(API + "/motives?type=" + type, fetcher, {
    revalidateOnFocus: false,
  });

  return {
    motives: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export async function sendReport(id, type, data, jwt) {
  const data_post = data;
  if (type) {
    data_post["public_user"] = id;
  } else {
    data_post["publication"] = id;
  }

  try {
    const res = await axios.post(API + "/reports", data_post, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    });
    console.log(res.data);
  } catch (error) {
    console.log(error.response);
  }
}

export function useReports(jwt) {
  
  const fetchReports = (...args) =>
    fetch(...args, {
      headers: {
        Authorization: `bearer ${jwt}`,
      },
    }).then((res) => res.json());

  const { data, error } = useSWR(API + "/reports", fetchReports,{ refreshInterval: 5000 });

  return {
    reports: data,
    isLoading: !error && !data,
    isError: error,
  };
}


export async function updateReport(id, isAccepted, action, desc, jwt){
  try {
    const res = await axios.put(API + "/reports/"+id, {description:desc, accepted: isAccepted, action: action}, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    });
    console.log(res.data);
  } catch (error) {
    console.log(error.response);
  }
}