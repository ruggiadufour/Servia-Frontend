import RowProfile from "../../Components/Search/RowProfile";
import { getUsers } from "../../Api/users";
import {Wrapper1, Wrapper2} from "../../Components/Search/wrappers";

export default function Search({ profiles }) {
  return (
    <Wrapper1>
      {profiles.map((profile, i) => (
        <Wrapper2 key={i}>
          <RowProfile profile={profile} />
        </Wrapper2>
      ))}
    </Wrapper1>
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
  if(query.id){
    q["id"] = query.id;
  }

  const data = await getUsers(q);

  return {
    props: {
      profiles: data,
    },
  };
}
