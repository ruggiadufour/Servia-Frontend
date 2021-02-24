import { useState, useEffect } from "react";
//Material UI
import {
  Grid,
  Link as LinkMUI,
  LinearProgress,
  Modal,
  Backdrop,
  Fade,
  Typography,
  TextField,
  Hidden,
  Button,
  Divider,
} from "@material-ui/core";

import axios from "axios";
import { setCookie } from "nookies";
import { useRouter } from "next/router";
import Link from "next/link";

export default function IniciarSesion({ mensaje }) {
  const [cargando, setcargando] = useState(false);
  const [alerta, setalerta] = useState("");
  const API = process.env.NEXT_PUBLIC_API;
  const router = useRouter();

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
    setcargando(true);

    axios
      .post(
        "http://localhost:1337/auth/local",
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

        setcargando(false);
        router.push("/");
      })
      .catch((error) => {
        let err = JSON.parse(error.response.request.response).message[0]
          .messages[0].id;
        if (err === "Auth.form.error.invalid")
          setalerta("Correo o contraseña incorrectos");

        setcargando(false);
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
            <Typography color="error">{alerta}</Typography>
          </Hidden>

          <Grid item xs={12} align="center">
            <a href="#" className="centering text-secondary-1">Olvidé mi contraseña</a>
          </Grid>

          <div hidden={!cargando}>
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
