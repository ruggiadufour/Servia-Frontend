import { useContext, useEffect, useState } from "react";
import { UserState } from "../../States/User";
import RowPublication from "../../Components/Search/RowPublication";
import { getPublications } from "../../Api/publications";
import { Wrapper1, Wrapper2 } from "../../Components/Search/wrappers";

import Image from "next/image";
import Link from "next/link";

export default function Mine() {
  const [publications, setPublications] = useState([]);
  const { UState } = useContext(UserState);

  useEffect(async () => {
    const data = await getPublications({
      type: false,
      public_user: UState?.user.public_user.id,
    });
    setPublications(data);
  }, []);

  function removeOne(id) {
    console.log(id);
    setPublications(publications.filter((pub) => pub.id !== id));
  }

  if (publications.length === 0) {
    return (
      <div className="centering flex-col">
        <h1>
          No creaste ninguna solicitud todavía.
          <br />
          Hacelo haciendo{" "}
          <Link href="/solicitudes/crear">
            <a className="text-primary-2">click acá</a>
          </Link>
        </h1>

        <Image src="/create.svg" width={200} height={200} layout="intrinsic" />
      </div>
    );
  }

  return (
    <>
      <h1 className="centering-t">Mis servicios solicidados</h1>
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
