import Head from "next/head";
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
    <>
      <Head>
        <title>Buscando perfiles de proveedores</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Wrapper1>
        {profiles.map((profile, i) => (
          <Wrapper2 key={i}>
            <RowProfile profile={profile} />
          </Wrapper2>
        ))}
      </Wrapper1>
    </>
  );
}

export async function getServerSideProps({ resolvedUrl }) {
  const data = await getUsers(resolvedUrl);

  return {
    props: {
      profiles: data,
    },
  };
}
