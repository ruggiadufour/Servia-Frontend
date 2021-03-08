import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
//Material-UI
import {
  IconButton,
  LinearProgress,
  Container,
  Paper,
  Grid,
  Typography,
} from "@material-ui/core/";
import {
  DeleteForever as Eliminar,
  FiberNew as Nuevo,
  Assignment as Reporte,
  EmojiPeople as Identidad,
  Star as Resena,
  FormatItalic,
} from "@material-ui/icons/";
import Alerta from "@material-ui/lab/Alert";

//Librerías
//import 'react-lightbox-component/build/css/index.css';
import { format, register } from "timeago.js";

//import RealizarOpinion from './RealizarOpinion.js'
import ReactMarkdown from "react-markdown";
import { UserState } from "../../States/User";

import {
  setRead,
  deleteNotification,
  getTypeIcon,
} from "../../Api/notifications";

export default function VerificarIdentidad() {
  const { NState, UState, NDispatch } = useContext(UserState);

  //Variables del componente
  const [notifications, setNotifications] = useState(NState ? NState : []);
  const [loading, setLoading] = useState(false);

  useEffect(async () => {
    //Setting all notifications in read
    const some = notifications.some((notif) => notif.read === false);
    if (some) {
      const { data } = await setRead(UState.jwt);
      if (data) {
        console.log(data);

        NDispatch({
          type: "setNotifications",
          payload: data.reverse(),
        });
      }
    }
  }, []);

  async function deleteNotif(id) {
    const { data } = await deleteNotification(id, UState.jwt);
    console.log(data);
    if (data) {
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    }
  }

  /*
    Notification types:
    type 0: Report notification, when the profile/publication is blocked o unblocked.
    type 1: ID verification, when the user request an ID verification will receive a accepted or rejected notification.
    type 2: Contact, when the user is contacted by another one.
  */
  // La siguiente función es de una librería que permite ver fechas en términos mas amigables (ej. hace 1 hora, hace 5 dias, etc.)
  function localeFunc(number, index, totalSec) {
    // number: the timeago / timein number;
    // index: the index of array below;
    // totalSec: total seconds between date to be formatted and today's date;
    return [
      ["justo ahora", "justo ahora"],
      ["hace %s segundos", "en %s segundos"],
      ["hace 1 minuto", "en 1 minuto"],
      ["hace %s minutos", "en %s minutos"],
      ["hace 1 hora", "en 1 hora"],
      ["hace %s horas", "en %s horas"],
      ["hace 1 día", "en 1 día"],
      ["hace %s días", "en %s días"],
      ["hace 1 semana", "en 1 semana"],
      ["hace %s semanas", "en %s semanas"],
      ["hace 1 mes", "en 1 mes"],
      ["hace %s meses", "en %s meses"],
      ["hace 1 año", "en 1 año"],
      ["hace %s años", "en %s años"],
    ][index];
  }
  register("spanish", localeFunc);

  return (
    <>
      <div className="background-primary-1 w-100 medium-width centering-t p-15">
        <Typography variant="h4" component="h4" align="center">
          Notificaciones
        </Typography>
        <br />

        {loading && (
          <div className="w-100">
            <LinearProgress />
          </div>
        )}

        {
          //Si no se esta cargando (buscando las notificaciones) y si no se tienen notificaciones, se muestra un mensaje indicando de que el usuario no tiene
          !loading && notifications.length === 0 && (
            <Alerta variant="outlined" severity="info" className="w-100">
              No tenés notificaciones nuevas.
            </Alerta>
          )
        }
        {
          //El siguiente mapeo muestra todas las notificaciones que el usuario tiene, como pueden haber
          //distintos tipos de notificaciones, se consideran diferentes casos para mostrarlas
          notifications.map((notif, i) => (
            <Paper key={i} className="w-100 p-15">
              <div className="paper">
                <span className="type-notification">
                  {getTypeIcon(notif.type)}
                </span>
                <div>
                  <ReactMarkdown source={notif.description} />

                  {format(new Date(notif.created_at), "spanish")}
                </div>
                <span
                  className="delete"
                  onClick={() => {
                    deleteNotif(notif.id);
                  }}
                >
                  ❌
                </span>
              </div>
            </Paper>
          ))
        }
      </div>
      <style jsx>
        {`
          .paper {
            position: relative;
            display: flex;
            align-items: center;
          }
          .delete {
            position: absolute;
            top: 0;
            right: 0;
            cursor: pointer;
          }
        `}
      </style>
    </>
  );
}
