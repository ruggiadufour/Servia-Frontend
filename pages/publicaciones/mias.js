import { useContext, useEffect, useState } from "react";
import { UserState } from "../../States/User";
import RowPublication from "../../Components/Search/RowPublication";
import { getPublications } from "../../Api/publications";
import { Wrapper1, Wrapper2 } from "../../Components/Search/wrappers";

export default function Mine() {
  const [publications, setPublications] = useState([]);
  const { UState } = useContext(UserState);

  useEffect(async () => {
    const data = await getPublications({
      type: true,
      public_user: UState?.user.public_user.id,
      my: true,
    });
    setPublications(data);
  }, []);

  function removeOne(id) {
    console.log(id)
    setPublications(publications.filter((pub) => pub.id !== id));
  }

  return (
    <>
      <h1 className="centering-t">Mis publicaciones</h1>
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
