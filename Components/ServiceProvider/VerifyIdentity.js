import { useState, useEffect, useContext } from "react";
//Libreria para consultar la API del servidor
import axios from "axios";
//Material UI
import {
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  LinearProgress,
} from "@material-ui/core/";
//Componentes creados
import UploadImage from "../UploadImage";

import { AlertState } from "../../States/Alert";
import { UserState } from "../../States/User";

//import {} from '../../Api/logged_user'

//Componente que se utiliza por el usuario cuando quiere verificar su identidad
export default function VerificarMiIdentidad() {
  const { ADispatch } = useContext(AlertState);
  const { UState } = useContext(UserState);
  const API = process.env.NEXT_PUBLIC_API;

  //States
  const [loading, setLoading] = useState(false);
  const [DNI, setDNI] = useState(UState.user.dni);
  const [images, setImages] = useState([]);

  function save(e) {
    e.preventDefault();
    if (images.length!==2) {
      ADispatch({
        type: "setAlert",
        payload: {
          desc: "Debe subir 2 fotos de su DNI.",
          type: "warning",
          open: true,
        },
      });
    } else {
      const formData = getFormData();
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
              desc: "¡Su solicitud ha sido enviada satisfactoriamente! Un administrador la validará lo mas antes posible.",
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
          setLoading(false);
        });
    }
  }

  function getFormData() {
    const formData = new FormData();

    for (let i = 0; i < images.length; i++) {
      formData.append("files.photos", images[i]);
    }

    formData.append(
      "data",
      JSON.stringify({ private_usr: { dni: DNI, waiting_verification: true } })
    );

    return formData;
  }

  return (
    <div className="medium-width centering-t">
      <form onSubmit={save}>
        <Grid spacing={1} container justify="space-between" alignItems="center">
          <Grid item xs={12}>
            <Typography variant="h5" component="h1" align="center">
              Verificar mi identidad
            </Typography>
          </Grid>

          <Grid item xs={12} align="center">
            <TextField
              type="number"
              name="dni"
              value={DNI}
              onChange={(e) => {
                setDNI(e.target.value);
              }}
              label="Número de documento"
              variant="filled"
              className="w-100"
              required
              disabled={
                UState.user.waiting_verification ||
                UState.user.public_user.verified
              }
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" align="justify">
              Para que puedas verificar tu identidad, necesitamos que subas una
              foto del frente y otra del dorso de tu DNI. Procura que ambas
              imágenes se vean legibles y correspondan con los datos que
              proporcionaste en tu perfil.
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <UploadImage
              setFiles={setImages}
              Files={images}
              amount={2}
              preloadImages={UState.user.dni_image?.photos?UState.user.dni_image.photos:[]}
              setToDelete={() => {}}
              disabled={
                UState.user.public_user.verified ||
                UState.user.waiting_verification
              }
            />
          </Grid>

          <Grid item xs={12}>
            {loading && <LinearProgress />}
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" align="center" color="error">
              {UState.user.waiting_verification &&
                "Ya tenés una solicitud de verificación pendiente."}
            </Typography>
            <Typography variant="subtitle1" align="center" color="primary">
              {UState.user.public_user.verified &&
                "¡Tu perfil ya está verificado!"}
            </Typography>
          </Grid>

          <Grid item xs={12} align="center">
            <Button
              type="submit"
              size="large"
              variant="contained"
              color="primary"
              disabled={
                loading ||
                UState.user.public_user.verified ||
                UState.user.waiting_verification
              }
            >
              Enviar solicitud
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}
