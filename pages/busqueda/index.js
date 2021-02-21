import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

import { FilterState } from "../../States/Filter";
import RowPublication from "../../Components/Search/RowPublication";
import RowProfile from "../../Components/Search/RowProfile";

import { getPublications } from "../../Api/publications";
import { getUsers } from "../../Api/users";

export default function Search() {
  const router = useRouter();

  const { FState } = useContext(FilterState);
  const [publications, setPublications] = useState([]);
  const [profiles, setProfiles] = useState([]);

  useEffect(async () => {
    if (!FState) {
      router.push("/");
    } else {
      if (FState.state.is_profile) {
        let data = await getUsers(FState.state);
        console.log(data);
        setProfiles(data);
      } else {
        let data = await getPublications(FState.state);
        console.log(data);
        setPublications(data);
      }
    }
  }, [FState]);

  if (!FState) {
    return <h1>loading</h1>;
  }

  return (
    <>
      <div className="general-width w-100 row-container flex-row background-2">
        {FState.state.is_profile ? (
          <>
            {
              //Rendering profiles
              profiles.map((profile, i) => (
                <div className="row background-1" key={i}>
                  <RowProfile profile={profile} />
                </div>
              ))
            }
          </>
        ) : (
          <>
            {
              //Rendering publications
              publications.map((publication, i) => (
                <div className="row background-1" key={i}>
                  <RowPublication publication={publication} />
                </div>
              ))
            }
          </>
        )}
      </div>
      <style jsx>
        {`
          .row {
            border: solid thin gray;
            background-color: lightgray;
            padding: 10px;
            border-radius: 5px;
          }
          .row-container {
            margin: 15px auto;
          }
        `}
      </style>
    </>
  );
}
