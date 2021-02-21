import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios'
import {Link} from 'react-router-dom'
//Material-UI
import {Grid, LinearProgress, ListItem, ListItemIcon, Divider, Typography, MenuItem} from '@material-ui/core';
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';
import Alerta from '@material-ui/lab/Alert';
import { EmojiSymbolsRounded } from '@material-ui/icons';

//Estilos
import Estilos from '../Estilos.js'
//Variables de estado global del sistema
import { ObtenerEstadoAplicacion } from '../../Estados/AplicacionEstado'

//Este componente permite mostrar información breve de las últimas reseñas que el usuario tiene, este componente
//es accedido por medio del ícono de campana en la barra de navegación
export default function NotificacionesNav({plegarNoti, notificaciones}) {
    const classes = Estilos();
    const { state, dispatch } = useContext(ObtenerEstadoAplicacion);

    return (
        <div style={{padding:"0px 15px 0px 15px"}}>
            <Typography align="center" component="h5" variant="h5">Notificaciones</Typography>
            {/*Si el usuario no tiene notificaciones, se le informa.*/}
            {notificaciones.length===0 && <Typography>No tienes nuevas notificaciones</Typography>}
            {
                notificaciones.map((noti, i)=>(
                    <div key={i}>
                        <MenuItem onClick={plegarNoti} >
                            <Grid container spacing={1} justify="center">
                                <Grid item xs={12}>
                                    <Link to={state.ruta+"/notificaciones"} className={classes.EstiloLink}>
                                        <Typography>  
                                            {/*Según el tipo de notificación, se muestra uno u otro mensaje de descripción*/}                          
                                            {noti.tipo===0 && (noti.solicitud!==null?
                                            'Tienes nueva información con respecto a un reporte hecho a tu publicación "'+noti.solicitud.titulo+'"':
                                            "Tienes nueva información sobre un reporte hecho a tu perfil")}
                                            {noti.tipo===1 && (noti.datos_notificacion===""?
                                            '¡Tu solicitud de verificación de identidad ha sido aceptada!':
                                            'Tu solicitud de verificación de identidad ha sido rechazada.')}
                                            {noti.tipo===2 && (`¡Tienes una nueva solicitud de reseña de ${noti.emisor.nombre} ${noti.emisor.apellido}!`)}
                                        </Typography>
                                    </Link>
                                </Grid>
                            </Grid>
                        </MenuItem>
                        <Divider/>
                    </div>
                ))
            }
            <MenuItem onClick={plegarNoti}>
                    <Link to={state.ruta+"/notificaciones"} className={classes.EstiloLink}>
                        <Typography color="secondary">                            
                            Ver todas las notificaciones
                        </Typography>
                    </Link>
            </MenuItem>
        </div>
    );
}