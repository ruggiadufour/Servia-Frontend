import RowPublication from "../../Components/Search/RowPublication";
import { getPublications } from "../../Api/publications";
import {Wrapper1, Wrapper2} from "../../Components/Search/wrappers";
import { useState } from "react";

export default function Search({ publications }) {
  const [thisPublications, setThisPublications] = useState(publications)

  function removeOne(id) {
    console.log(id)
    setThisPublications(thisPublications.filter((pub) => pub.id !== id));
  }

  return (
    <>
      <Wrapper1>
        {
          //Rendering publications
          thisPublications.map((publication, i) => (
            <Wrapper2 key={i}>
              <RowPublication publication={publication} removeOne={removeOne}/>
            </Wrapper2>
          ))
        }
      </Wrapper1>
    </>
  );
}

export async function getServerSideProps({ query }) {
  let q = {};
  if(query.province && query.city){
    q["province"] = query.province
    q["city"] = query.city
  }

  if (query.word) {
    q["word"] = query.word;
  }
  if (query.category_id) {
    q["category_id"] = query.category_id;
  }
  if (query.type) {
    q["type"] = query.type;
  }
  if(query.public_user){
    q["public_user"] = query.public_user
  }

  const data = await getPublications(q);

  return {
    props: {
      publications: data,
    },
  };
}
