import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Link from "next/link";
import Router from "next/router";
//States
import { AlertState } from "../../States/Alert";
import { UserState } from "../../States/User";

import { setCookie } from "nookies";

//Material UI
import {
  LinearProgress,
  Typography,
  TextField,
  Button,
  Divider,
  Paper,
  Grid,
  Checkbox,
  FormControlLabel,
  Hidden,
} from "@material-ui/core/";
import UploadImage from '../../Components/UploadImage'

//Componente utilizado para registrar un nuevo usuario o para modificar los datos de un usuario
export default function SignIn({ registrar }) {
  const { ADispatch } = useContext(AlertState);
  const { UDispatch } = useContext(UserState);

  //Variables de la página
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const API = process.env.NEXT_PUBLIC_API;
  //Variables de los campos
  const [profileImage, setProfileImage] = useState([]);
  const [user, setUser] = useState({
    name: "",
    surname: "",
    email: "",
    username: "",
    phone: "",
    password: "",
    password_again: "",
    dni: "",
    description: "",
    profileImage: null,
  });
  //Proveedor
  const [isProvider, setIsProvider] = useState(false);

  //Si se quiere modificar los datos, entonces seteamos los datos del usuario en los campos
  useEffect(() => {
    // setdatos({
    //     nombre: state.datosSesion.nombre,
    //     apellido: state.datosSesion.apellido,
    //     email: state.datosSesion.email,
    //     usuario: state.datosSesion.username,
    //     telefono: state.datosSesion.telefono,
    //     contrasena: "",
    //     contrasena_rep: "",
    //     dni: state.datosSesion.dni,
    //     descripcion: state.datosSesion.descripcion,
    //     tipo: state.datosSesion.tipo,
    //     imagen_perfil: state.datosSesion.imagen_perfil
    // })
    // if(state.datosSesion.imagen_perfil!==null)
    //     setimagenes([state.datosSesion.imagen_perfil.id])
  }, []);

  //Cada vez que se escribe algo en un campo, lo capturamos y lo seteamos en los datos
  const handleChange = (e) => {
    if (message !== "") setMessage("");

    let value = e.target.value;
    let name = e.target.name;
    setUser({
      ...user,
      [name]: value,
    });
  };

  //Función para subir las imágenes
  function subirImagen(datos) {
    let archivosNuevos = [];
    let auth = "Bearer " + datos.jwt;

    //archivosNuevos es el arreglo que contiene los archivos que han sido agregados y no los que ya han sido subidos al servidor
    ImagenPerfil.map((imagen) => {
      let iguales = imagenesSubidas.some((img) => img === imagen);
      if (!iguales) {
        archivosNuevos.push(imagen);
      }
    });
    //archivosBorrados es el arreglo que contiene los archivos que han sido subidos al servidor pero que han sido eliminados en el frontend
    let archivosBorrados = [];
    imagenesBorradas.map((imagen) => {
      let iguales = imagenesSubidas.some((img) => img === imagen);
      if (iguales) {
        archivosBorrados.push(imagen);
      }
    });
    //Si existen elementos dentro del arreglo imagenesBorradas, significa que se quieren borrar imágenes de la publicación
    for (let indx = 0; indx < imagenesBorradas.length; indx++) {
      let id = Number(imagenesBorradas[indx].name);

      axios
        .delete("/upload/files/" + id, {
          headers: {
            Authorization: auth,
          },
        })
        .then((response) => {})
        .catch((error) => {
          console.log("Error al borrar las imagenes");
          console.log(error.response);
        });
    }

    //Subiendo las imagenes seleccionadas
    const formData = new FormData();

    //Se cargan en el fromData las nuevas imágenes cargadas a la publicación, si es que las hay, y los datos modificados
    for (let i = 0; i < archivosNuevos.length; i++) {
      formData.append("files", archivosNuevos[i]);
    }

    if (archivosNuevos.length !== 0) {
      formData.append("ref", "user");
      formData.append("refId", datos.usuario.id);
      formData.append("field", "imagen_perfil");
      formData.append("source", "users-permissions");

      axios
        .post("/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: auth,
          },
        })
        .then((response) => {
          let usr = datos.usuario;
          usr.imagen_perfil = response.data[0];

          dispatch({ type: "setDatos", value: usr });
          dispatch({ type: "setJwt", value: datos.jwt });

          localStorage.setItem(
            "datosLocal",
            JSON.stringify({
              jwt: datos.jwt,
              datosSesion: usr,
            })
          );
        })
        .catch((error) => {
          console.log("Error: ", error.response);
        });
    }
  }

  //Funcion para enviar los datos, ya sea de modificación de perfil como de creación de una cuenta nueva
  const signIn = (e) => {
    e.preventDefault();
    if (
      user.email.search("[.][a-z][a-z]") === -1 ||
      user.email.search("[.].*[0-9].*") !== -1
    ) {
      setMessage("El email se encuentra escrito incorrectamente");
    } else {
      if (true) {
        if (user.password !== user.password_again) {
          setMessage("Las contraseñas no coinciden");
        } else if (user.password.length < 8) {
          setMessage("La contraseña debe tener al menos 8 caracteres");
        } else {
          //Si se entra a acá, significa que se quiere crear un nuevo usuario
          toPost();
        }
      } else {
        if (
          user.email.search("[.][a-z][a-z]") === -1 ||
          user.email.search("[.].*[0-9].*") !== -1
        ) {
          setMessage("El email se encuentra escrito incorrectamente");
        } else {
          //Si se entra a acá, significa que se quiere modificar el usuario
        }
      }
    }
  };

  //Función que se ejecuta si se quiere crear un usuario nuevo
  async function toPost() {
    setLoading(true);
    axios
      .post(API + "/auth/local/register", {
        username: user.username,
        email: user.email,
        password: user.password,
        name: user.name,
        surname: user.surname,
        phone: user.phone,
        dni: user.dni,
        description: user.description,
        type: isProvider ? 2 : 1,
        confirmed: false,
        state: false,
        show_phone: false,
        verified: false,
        waiting_verification: false,
        blocked: false,
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
          setMessageAlert({
            desc:
              "Ha ocurrido un error grave, contacte a un administrador por favor.",
            type: "error",
          });
          setOpenAlert(true);
        }
        setLoading(false);
      });
  }

  return (
    <div className="medium-width centering-t">
      <form onSubmit={signIn}>
        <Grid spacing={2} container justify="space-between" alignItems="center">
          <Grid item xs={12}>
            <Typography variant="h5" component="h1" align="center">
              Registrar usuario
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <TextField
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              label="Nombre"
              variant="filled"
              required
              className="w-100"
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              type="text"
              name="surname"
              value={user.surname}
              onChange={handleChange}
              label="Apellido"
              variant="filled"
              required
              className="w-100"
            />
          </Grid>

          <Grid item xs={12}>
            <UploadImage/>
          </Grid>

          <Grid item xs={12}>
            <TextField
              name="email"
              value={user.email}
              onChange={handleChange}
              label="Correo electrónico"
              variant="filled"
              type="email"
              required
              className="w-100"
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              name="username"
              value={user.username}
              onChange={handleChange}
              label="Usuario"
              variant="filled"
              required
              className="w-100"
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              type="number"
              name="phone"
              value={user.phone}
              onChange={handleChange}
              label="Telefono"
              variant="filled"
              className="w-100"
            />
          </Grid>
          <Divider />

          <Grid item xs={6}>
            <TextField
              required={registrar}
              name="password"
              value={user.password}
              onChange={handleChange}
              type="password"
              label="Contraseña"
              variant="filled"
              className="w-100"
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              required={registrar}
              name="password_again"
              value={user.password_again}
              onChange={handleChange}
              type="password"
              label="Repetir contraseña"
              variant="filled"
              className="w-100"
            />
          </Grid>

          <Hidden xlDown={message === ""}>
            <Grid item xs={12}>
              <Typography color="error">{message}</Typography>
            </Grid>
          </Hidden>

          <Grid item xs={12}>
            <OkProveedor
              isProvider={isProvider}
              setIsProvider={setIsProvider}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              size="large"
              variant="contained"
              color="primary"
              disabled={loading}
              className="centering"
            >
              {"Registrar Usuario"}
            </Button>
          </Grid>

          <div hidden={!loading} className="w-100">
            <LinearProgress />
          </div>
          <Grid item xs={12}>
            <Link href="/sesion">
              <a className="centering text-secondary-1">
                ¿Ya tenés una cuenta?
              </a>
            </Link>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}

function OkProveedor({ setIsProvider, isProvider }) {
  const manejarCambio = (event) => {
    setIsProvider(!isProvider);
  };

  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={isProvider}
          onChange={manejarCambio}
          name="is_provider"
          color="primary"
        />
      }
      label="Soy proveedor de servicios"
    />
  );
}
