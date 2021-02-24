import RowPublication from "../../Components/Search/RowPublication";
import { getPublications } from "../../Api/publications";
import {Wrapper1, Wrapper2} from "../../Components/Search/wrappers";

export default function Search({ publications }) {
  return (
    <>
      <Wrapper1>
        {
          //Rendering publications
          publications.map((publication, i) => (
            <Wrapper2 key={i}>
              <RowPublication publication={publication} />
            </Wrapper2>
          ))
        }
      </Wrapper1>
    </>
  );
}

export async function getServerSideProps({ query }) {
  let q = {};
  if (query.word) {
    q["word"] = query.word;
  }
  if (query.category_id) {
    q["category_id"] = query.category_id;
    q["type"] = query.type;
  }

  const data = await getPublications(q);

  return {
    props: {
      publications: data,
    },
  };
}
