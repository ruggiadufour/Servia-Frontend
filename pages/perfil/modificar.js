import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Router from "next/router";
//States
import { AlertState } from "../../States/Alert";
import { UserState } from "../../States/User";
import { setCookie } from "nookies";
import RegisterModify from "../../Components/Session/Register-Modify";

//Componente utilizado para registrar un nuevo usuario o para modificar los datos de un usuario
export default function Change() {
  const API = process.env.NEXT_PUBLIC_API;
  const { ADispatch } = useContext(AlertState);
  const { UState, UDispatch } = useContext(UserState);

  //Variables de la página
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);

  return (
    <RegisterModify
      UState={UState}
      submit={changeData}
      loading={loading}
      message={message}
      setMessage={setMessage}
      setProfile={setProfile}
      register={false}
    />
  );

  //Función que se ejecuta si se quiere crear un usuario nuevo
  async function changeData(user) {
    setLoading(true);
    let formData = getFormData(user);

    // /users/5
    axios
      .put(API + "/users/" + UState.user.id, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${UState.jwt}`,
        },
      })
      .then((response) => {
        setLoading(false);
        ADispatch({
          type: "setAlert",
          payload: {
            desc: "¡Su cuenta ha sido modificada satisfactoriamente!",
            type: "success",
            open: true,
          },
        });

        UDispatch({
          type: "setUser",
          payload: { user: response.data, jwt: UState.jwt },
        });

        // setCookie(
        //   null,
        //   "session",
        //   JSON.stringify({ user: response.data, jwt: UState.jwt }),
        //   {
        //     maxAge: 30 * 24 * 60 * 60,
        //     path: "/",
        //   }
        // );

        //Router.push("/");
      })
      .catch((error) => {
        // Ocurrió un error
        let err = JSON.parse(error.response.request.response).message[0]
          .messages[0].id;
        if (err === "Auth.form.error.email.taken")
          setMessage("El email ya está en uso.");
        else if (err === "Auth.form.error.username.taken")
          setMessage("El usuario ya está en uso.");
        else {
          ADispatch({
            type: "setAlert",
            payload: {
              desc:
                "Ha ocurrido un error grave en nuestros servidores, por favor, contacte a un administrador.",
              type: "error",
              open: true,
            },
          });
        }
        setLoading(false);
      });
  }

  function getFormData(user) {
    const formData = new FormData();
    if (profile) formData.append("files.profile", profile);
    console.log(user)
    formData.append(
      "data",
      JSON.stringify({
        private_usr: {
          username: user.username,
          email: user.email,
          //password: user.password,
          //dni: user.dni,
          type: 1,
          dni: "50",
          //waiting_verification: false,
        },
        public_usr: {
          name: user.name,
          surname: user.surname,
          blocked: false,
          show_phone: true,
          verified: false,
          phone: user.phone,
          description: user.description,
          state: false,
          location: "",
          //id_private: UState.user.id,
        },
      })
    );

    return formData;
  }
}
