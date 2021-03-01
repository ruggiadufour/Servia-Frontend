import RowProfile from "../../Components/Search/RowProfile";
import { getUsers } from "../../Api/users";
import { Wrapper1, Wrapper2 } from "../../Components/Search/wrappers";
import Image from "next/image";
export default function Search({ profiles }) {
  if (profiles.length === 0) {
    return (
      <div className="centering flex-col">
        <h1>
          Lo sentimos, no encontramos resultados para los filtros aplicados.
        </h1>

        <Image
          src="/search-not-found.png"
          width={200}
          height={200}
          layout="intrinsic"
        />
      </div>
    );
  }

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
  if (query.province && query.city) {
    q["province"] = query.province;
    q["city"] = query.city;
  }

  if (query.word) {
    q["word"] = query.word;
  }
  if (query.category_id) {
    q["category_id"] = query.category_id;
    q["type"] = query.type;
  }
  if (query.id) {
    q["id"] = query.id;
  }

  const data = await getUsers(q);

  return {
    props: {
      profiles: data,
    },
  };
}
