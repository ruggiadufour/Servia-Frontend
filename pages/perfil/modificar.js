import { useState, useContext } from "react";
import Head from "next/head";
import axios from "axios";
import Router from "next/router";
//States
import { AlertState } from "../../States/Alert";
import { UserState } from "../../States/User";
import RegisterModify from "../../Components/Session/Register-Modify";

export default function Change() {
  const API = process.env.NEXT_PUBLIC_API;
  const { ADispatch } = useContext(AlertState);
  const { UState, UDispatch } = useContext(UserState);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState([]);

  return (
    <>
      <Head>
        <title>Modificar mi perfil</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <RegisterModify
        submit={changeData}
        loading={loading}
        setLoading={setLoading}
        message={message}
        setMessage={setMessage}
        setProfile={setProfile}
        profile={profile}
        register={false}
      />
    </>
  );

  async function changeData(user) {
    let formData = getFormData(user);

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

        Router.push("/");
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
    console.log(profile);
    if (profile.length !== 0) formData.append("files.profile", profile[0]);
    formData.append(
      "data",
      JSON.stringify({
        private_usr: {
          username: user.username,
          email: user.email,
          //password: user.password,
          type: user.type,
        },
        public_usr: {
          name: user.name,
          surname: user.surname,
          show_phone: user.show_phone,
          phone: user.phone,
          description: user.description,
          state: user.state,
          categories: user.categories,
        },
        location: {
          city: user.city,
          province: user.province,
        },
      })
    );

    return formData;
  }
}
