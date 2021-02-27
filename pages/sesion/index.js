import { useState, useContext } from "react";
//Material UI
import {
  Grid,
  LinearProgress,
  Typography,
  TextField,
  Hidden,
  Button,
  Divider,
} from "@material-ui/core";

//Set state and cookies
import axios from "axios";
import { setCookie } from "nookies";
import { useRouter } from "next/router";
import { UserState } from "../../States/User";
import Link from "next/link";

export default function IniciarSesion({ mensaje }) {
  const { UDispatch } = useContext(UserState);
  const API = process.env.NEXT_PUBLIC_API;
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [data, setData] = useState({
    identifier: "",
    password: "",
  });

  const handleChange = (e) => {
    let value = e.target.value;
    let field = e.target.name;
    setData({
      ...data,
      [field]: value,
    });
  };

  async function logIn() {
    setLoading(true);

    axios
      .post(
        API + "/auth/local",
        {
          identifier: data.identifier,
          password: data.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log("Well done!");
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

        setLoading(false);
        router.push("/");
      })
      .catch((error) => {
        console.log(error.response);
        let err = JSON.parse(error.response.request.response).message[0]
          .messages[0].id;
        if (err === "Auth.form.error.invalid")
          setMessage("Correo o contraseña incorrectos");

        setLoading(false);
      });
  }

  return (
    <>
      <div className="login centering p-15">
        <Grid container direction="row" justify="center" spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h5" component="h1" align="center">
              Iniciar Sesión
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField
              onChange={handleChange}
              value={data.identifier}
              name="identifier"
              id="filled-basic"
              label="Correo electrónico"
              variant="filled"
              className="w-100"
              required
            />
          </Grid>
          <Divider />

          <Grid item xs={12}>
            <TextField
              onChange={handleChange}
              name="password"
              value={data.password}
              required
              type="password"
              label="Contraseña"
              variant="filled"
              className="w-100"
            />
          </Grid>

          <Hidden xlDown={mensaje === ""}>
            <Typography color="error">{message}</Typography>
          </Hidden>

          <Grid item xs={12} align="center">
            <a href="#" className="centering text-secondary-1">
              Olvidé mi contraseña
            </a>
          </Grid>

          <div hidden={!loading} className="w-100">
            <LinearProgress />
          </div>

          <Grid item xs={12} align="center">
            <Button
              onClick={logIn}
              size="large"
              variant="contained"
              color="primary"
            >
              Iniciar Sesión
            </Button>
          </Grid>

          <Divider />

          <Grid item xs={12}>
            <Typography variant="body1" align="center">
              {`¿Eres nuevo en el sitio? `}
            </Typography>
            <Typography variant="body1" align="center">
              <Link href="/sesion/registrar">
                <a className="centering text-secondary-1">Creá una cuenta</a>
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </div>
      <style jsx>
        {`
          .login {
            max-width: 400px;
          }
        `}
      </style>
    </>
  );
}
