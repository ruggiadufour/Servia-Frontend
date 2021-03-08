import React, { useState, useContext } from "react";
import { useRouter } from "next/router";
//Material-UI
import {
  LinearProgress,
  Avatar,
  FormControl,
  Grid,
  Typography,
  TextField,
  Button,
  Modal,
  Fade,
  Backdrop,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core/";
import { Mail } from "@material-ui/icons";

import { UserState } from "../States/User";

//Subcomponente que se muestra en aquellas vistas en donde requerimos que se pueda contactar con un proveedor
export default function BotonContratar({ isFixed, type, profile }) {
  const { socket, UState } = useContext(UserState);
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [cargando, setcargando] = useState(false);
  const [message, setMessage] = useState("");

  //Si se abre o se cierra la ventan emergente...
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  function contact(e) {
    if (UState) {
      e.preventDefault();
      socket.emit(
        "contact-provider",
        JSON.stringify({
          id_provider_public: profile.id,
          type,
          message,
          id_sender_private: UState.user.id,
          jwt: UState.jwt,
          name: `${UState.user.public_user.name} ${UState.user.public_user.surname}`,
        })
      );
      setMessage("");
      setOpen(false);
    } else {
      router.push("/sesion");
    }
  }

  function getImage() {
    const API = process.env.NEXT_PUBLIC_API;
    let url = profile.profile?.url ? API + profile.profile.url : "/IconoV2.png";
    return url;
  }

  return (
    <>
      <Button
        variant="contained"
        color="inherit"
        onClick={handleOpen}
        className="button"
      >
        Contactar
      </Button>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
      >
        <div className="modal background-secondary-1 p-15">
          <div align="center">
            <Avatar alt="Perfil" src={getImage()} />
          </div>

          <Typography variant="h5" component="h2" align="center">
            {`Contactar proveedor ${profile.name} ${profile.surname}`}
          </Typography>

          <form onSubmit={contact}>
            <FormControl color="primary" fullWidth>
              <TextField
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
                id="filled-basic"
                label="Escribí tu mensaje"
                variant="filled"
                required
                multiline
                className="w-100"
              />

              <Button
                disabled={cargando}
                variant="contained"
                color="primary"
                type="submit"
              >
                Contactar
              </Button>
            </FormControl>
          </form>
        </div>
      </Modal>

      <style jsx>
        {`
          .modal {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
          .button{
            margin: 10px;
          }
        `}
      </style>
    </>
  );
}
