import axios from "axios";

export async function registration(formData, ADispatch, UDispatch, setCookie, setMessage) {
  const API = process.env.NEXT_PUBLIC_API;
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
    });
}
