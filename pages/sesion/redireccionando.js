import { useEffect, useContext } from "react";
import { useRouter } from "next/router";
import axios from "axios";

import { UserState } from "../../States/User";
import { setCookie } from "nookies";

import { CircularProgress } from "@material-ui/core";

const LoginRedirect = () => {
  const API = process.env.NEXT_PUBLIC_API;
  const router = useRouter();
  const { UDispatch, NDispatch } = useContext(UserState);

  useEffect(() => {
    let path = router.asPath;
    const provider = router.query.provider

    path = path.replace(`/sesion/redireccionando?provider=${provider}&`, "");

    axios
      .get(`${API}/auth/${provider}/callback${path}`)
      .then((response) => {
        const user_ = { ...response.data.user };
        delete user_.notifications;
        delete user_.dni_image;
        delete user_.chats;

        setCookie(
          null,
          "session",
          JSON.stringify({
            user: user_,
            jwt: response.data.jwt,
          }),
          {
            maxAge: 30 * 24 * 60 * 60,
            path: "/",
          }
        );

        NDispatch({
          type: "setNotifications",
          payload: response.data.user.notifications.reverse(),
        });

        UDispatch({
          type: "setUser",
          payload: { user: response.data.user, jwt: response.data.jwt },
        });

        if(!response.data.user.public_user.name){
          router.push("/perfil/modificar");
        }else{
          router.push("/")
        }
      })
      .catch((err) => {
        console.log(err.response);
      });
  }, []);

  return (
    <div className="centering">
      <CircularProgress />
    </div>
  );
};

export default LoginRedirect;
