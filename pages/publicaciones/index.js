import RowPublication from "../../Components/Search/RowPublication";
import { getPublications } from "../../Api/publications";
import { Wrapper1, Wrapper2 } from "../../Components/Search/wrappers";
import { useState, useEffect } from "react";
import Image from "next/image";
import Head from "next/head";

export default function Search({ publications }) {
  const [thisPublications, setThisPublications] = useState(publications);

  useEffect(() => {
    setThisPublications(publications);
  }, [publications]);

  function removeOne(id) {
    setThisPublications(thisPublications.filter((pub) => pub.id !== id));
  }

  if (thisPublications.length === 0) {
    return (
      <>
        <Head>
          <title>Sin resultados</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
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
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Buscando publicaciones</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Wrapper1>
        {
          //Rendering publications
          publications.map((publication, i) => (
            <Wrapper2 key={i}>
              <RowPublication publication={publication} removeOne={removeOne} />
            </Wrapper2>
          ))
        }
      </Wrapper1>
    </>
  );
}

export async function getServerSideProps({ resolvedUrl }) {
  const data = await getPublications(resolvedUrl);

  return {
    props: {
      publications: data,
    },
  };
}
