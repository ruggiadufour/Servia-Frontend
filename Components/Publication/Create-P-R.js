import { useState, useContext } from "react";
import { useRouter } from "next/router";

import { UserState } from "../../States/User";
import { AlertState } from "../../States/Alert";
import { createPublication, modifyPublication } from "../../Api/publications";

import CreateModify from "../../Components/Publication/Create-Modify";

export default function CreatePubReq({type, modify}) {
  const router = useRouter();
  const { UState } = useContext(UserState);
  const { ADispatch } = useContext(AlertState);
  const [loading, setLoading] = useState(false);

  async function save(publication, images) {
    if (images.length === 0) {
      setLoading(false);
      ADispatch({
        type: "setAlert",
        payload: {
          desc: "Debe ingresar al menos una imagen.",
          type: "info",
          open: true,
        },
      });
      return;
    }

    let error
    if(!modify){
      const res = await createPublication(publication, images, UState.jwt);
      error = res.error
    }else{
      const res = await modifyPublication(publication, images, UState.jwt);
      error = res.error
    }

    if (error) {
      ADispatch({
        type: "setAlert",
        payload: {
          desc: `Ha ocurrido un error al registrar su ${type?"publicación":"solicitud"}.`,
          type: "error",
          open: true,
        },
      });
    } else {
      ADispatch({
        type: "setAlert",
        payload: {
          desc: `¡Su ${type?"publicación":"solicitud"} ha sido creada satisfactoriamente!`,
          type: "success",
          open: true,
        },
      });
      router.push(`/publicaciones?type=${type}&public_user=${UState?.user.public_user.id}`)
    }

    setLoading(false);
  }
  return (
    <>
      <CreateModify
        loading={loading}
        setLoading={setLoading}
        submit={save}
        modify={modify}
        type={type}
      />
    </>
  );
}
