import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Router from "next/router";
//States
import { AlertState } from "../../States/Alert";
import { UserState } from "../../States/User";
import { setCookie } from "nookies";
import RegisterModify from "../../Components/Session/Register-Modify";

//Componente utilizado para registrar un nuevo usuario o para modificar los datos de un usuario
export default function SignIn() {
  const API = process.env.NEXT_PUBLIC_API;
  const { ADispatch } = useContext(AlertState);
  const { UState, UDispatch } = useContext(UserState);

  //Variables de la página
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [isProvider, setIsProvider] = useState(false);

  //Variables de los campos
  const [profileImage, setProfileImage] = useState([]);
  const [user, setUser] = useState({
    username: UState.user.username,
      email: UState.user.email,
      password: "",
      password_again: "",
      dni: UState.user.dni,
      type: UState.user.type,
      waiting_verification: UState.user.waiting_verification,
      name: UState.user.public_user.name,
      surname: UState.user.public_user.surname,
      show_phone: UState.user.public_user.show_phone,
      verified: UState.user.public_user.verified,
      phone: UState.user.public_user.phone,
      description: UState.user.public_user.description,
      state: UState.user.public_user.state,
  });

    console.log("XXXX")  

  return (
    <RegisterModify
      user={user}
      setUser={setUser}
      UState={UState}
      submit={signIn}
      loading={loading}
      message={message}
      setProfile={setProfile}
      setIsProvider={setIsProvider}
      isProvider={isProvider}
      register={true}
    />
  );

  //Función que se ejecuta si se quiere crear un usuario nuevo
  async function signIn() {
    setLoading(true);
    let formData = getFormData();

    axios
      .post(API + "/auth/local/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setLoading(false);

        ADispatch({
          type: "setAlert",
          payload: {
            desc: "¡Su cuenta ha sido creada satisfactoriamente!",
            type: "success",
            open: true,
          },
        });

        UDispatch({
          type: "setUser",
          payload: { user: response.data.user, jwt: response.data.jwt },
        });

        setCookie(
          null,
          "session",
          JSON.stringify({ user: response.data.user, jwt: response.data.jwt }),
          {
            maxAge: 30 * 24 * 60 * 60,
            path: "/",
          }
        );
        Router.push("/");
      })
      .catch((error) => {
        // Ocurrió un error
        console.log(error.response);
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

  function getFormData() {
    const formData = new FormData();
    if (profile) formData.append("files.profile", profile);

    formData.append(
      "data",
      JSON.stringify({
        private_usr: {
          username: user.username,
          email: user.email,
          password: user.password,
          dni: user.dni,
          type: isProvider ? 2 : 1,
          waiting_verification: false,
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
          id_private: null,
        },
      })
    );

    return formData;
  }
}
