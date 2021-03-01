import { useState, useContext } from "react";
import axios from "axios";
import {useRouter} from "next/router";
import { setCookie } from "nookies";
//States
import { AlertState } from "../../States/Alert";
import { UserState } from "../../States/User";
import RegisterModify from "../../Components/Session/Register-Modify";

export default function SignIn() {
  const API = process.env.NEXT_PUBLIC_API;
  const router = useRouter()
  const { ADispatch } = useContext(AlertState);
  const { UDispatch } = useContext(UserState);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState([]);

  return (
    <RegisterModify
      submit={signIn}
      loading={loading}
      setLoading={setLoading}
      message={message}
      setMessage={setMessage}
      setProfile={setProfile}
      profile={profile}
      register={true}
    />
  );

  async function signIn(user) {
    let formData = getFormData(user);

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

        setCookie(
          null,
          "session",
          JSON.stringify({ user: response.data.user, jwt: response.data.jwt }),
          {
            maxAge: 30 * 24 * 60 * 60,
            path: "/",
          }
        );

        UDispatch({
          type: "setUser",
          payload: { user: response.data.user, jwt: response.data.jwt },
        });

        router.push("/");
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
  
  function getFormData(user) {
    const formData = new FormData();
    if (profile.length!==0) formData.append("files.profile", profile[0]);

    formData.append(
      "data",
      JSON.stringify({
        private_usr: {
          username: user.username,
          email: user.email,
          password: user.password,
          type: user.type,
        },
        public_usr: {
          name: user.name,
          surname: user.surname,
          show_phone: user.show_phone,
          phone: user.phone,
          description: user.description,
          state: user.state,
          categories: user.categories
        },
        location:{
          city: user.city,
          province: user.province,
        }
      })
    );

    return formData;
  }
}
