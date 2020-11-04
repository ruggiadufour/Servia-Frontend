import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios'
//Material-UI
import {IconButton, LinearProgress, Collapse, Hidden, ListItemText, ListItem, List, Paper, Grid, Typography, Button, TextField} from '@material-ui/core/';
import {DeleteForever as Eliminar, FiberNew as Nuevo, Assignment as Reporte, EmojiPeople as Identidad} from '@material-ui/icons/';
import Alerta from '@material-ui/lab/Alert';
import 'react-lightbox-component/build/css/index.css';
import { format, register } from 'timeago.js';
//Estilos
import Estilos from '../Estilos.js'
import { ObtenerEstadoAplicacion } from '../../Estados/AplicacionEstado'
import { red } from '@material-ui/core/colors';

export default function VerificarIdentidad() {
    const classes = Estilos();
    const { state, dispatch } = useContext(ObtenerEstadoAplicacion);
    const [notificaciones, setnotificaciones] = useState([])
    const [cargando, setcargando] = useState(false);
    
    const [iconos, seticonos] = useState([<Reporte style={{ fontSize: "75px" }}/>, <Identidad style={{ fontSize: "75px" }}/>]);
    //
    const localeFunc = (number, index, totalSec) => {
        // number: the timeago / timein number;
        // index: the index of array below;
        // totalSec: total seconds between date to be formatted and today's date;
        return [
          ['justo ahora', 'justo ahora'],
          ['hace %s segundos', 'en %s segundos'],
          ['hace 1 minuto', 'en 1 minuto'],
          ['hace %s minutos', 'en %s minutos'],
          ['hace 1 hora', 'en 1 hora'],
          ['hace %s horas', 'en %s horas'],
          ['hace 1 día', 'en 1 día'],
          ['hace %s días', 'en %s días'],
          ['hace 1 semana', 'en 1 semana'],
          ['hace %s semanas', 'en %s semanas'],
          ['hace 1 mes', 'en 1 mes'],
          ['hace %s meses', 'en %s meses'],
          ['hace 1 año', 'en 1 año'],
          ['hace %s años', 'en %s años']
        ][index];
    };
    register('spanish', localeFunc);
    //
    useEffect(()=>{
        setcargando(true)
        let auth = 'Bearer '+state.jwt
        if (state.jwt!=="" || state.publico===true){            
            axios.get(state.servidor+"/api/notificaciones?receptor="+state.datosSesion.id,{
                headers: {'Authorization': auth},
            })
            .then(response => {
                console.log(response.data)
                setnotificaciones(response.data.reverse())

                response.data.map(notif=>{
                    if(notif.leido!==true){
                        definirLeido(notif.id)
                    }
                })
                
                setcargando(false)
            })
            .catch(error => {
                alert("Un error ha ocurrido al buscar las notificaciones.")
                console.log(error.response)
            }) 
        }
    },[state.jwt, state.publico])
    
    function eliminarNotificacion(id_){
        setnotificaciones(notificaciones.filter(notificacion=>notificacion.id!==id_))
        let auth = 'Bearer '+state.jwt
        axios.delete(state.servidor+"/api/notificaciones/"+id_,{
            headers: {'Authorization': auth},
        })
        .then(response => {
            console.log(response.data)
        })
        .catch(error => {
            alert("Un error ha ocurrido al eliminar la notificación.")
            console.log(error.response)
        }) 
    }

    function definirLeido(id_){
        let auth = 'Bearer '+state.jwt
        axios.put(state.servidor+"/api/notificaciones/"+id_,{
            leido: true
        },{
            headers: {'Authorization': auth},
        })
        .then(response => {
            console.log(response.data)
        })
        .catch(error => {
            alert("Un error ha ocurrido al cambiar la variable true.")
            console.log(error.response)
        }) 
    }

    return (
        <div className={classes.fondo}>
            <Paper style={{padding:"15px"}} variant="outlined" square>
                <Grid container direction="row" alignItems="center">
                    <Grid item xs={12}>
                        <Typography variant="h4" component="h4" align="center">
                            Notificaciones
                        </Typography>
                        <br/>
                    </Grid>
                    {
                        cargando && <Grid item xs={12}><LinearProgress/></Grid>
                    }
                    {
                        !cargando && notificaciones.length===0 && (<Grid item xs={12}><Alerta variant="outlined" severity="info">
                        No tienes notificaciones nuevas.
                        </Alerta></Grid>)
                    }  
                    {
                        notificaciones.map((noti, i)=>(
                            <Paper key={i} className={classes.filaPublicacion} style={{margin:"auto" ,width:"90%"}} variant="outlined" square>
                                <Grid container item xs={12} alignItems="center">
                                    <Grid item xs={12} sm={2} md={1} lg={1} align="center">
                                        {
                                            iconos[noti.tipo]
                                        }
                                    </Grid>
                                    <Grid item xs={10} sm={8} md={10} lg={10}>
                                            <Typography variant="h5" component="h5" align="left">
                                                {noti.tipo===0 && (noti.solicitud!==null?
                                                    'Reporte a la publicación "'+noti.solicitud.titulo+'"':
                                                    'Reporte a su perfil')}
                                                {noti.tipo===1 && 'Respuesta a tu solicitud de verificación de identidad'}
                                                {" - "+format(new Date(noti.created_at),"spanish")}
                                                {!noti.leido && <Nuevo style={{ color: red[500] }}/>}
                                            </Typography>
                                        <Typography align="justify">
                                            {noti.datos_notificacion!==""?noti.datos_notificacion:"¡Felicitaciones! Tu perfil ahora está verificado."}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={2} sm={2} md={1} lg={1} align="center">
                                        {
                                            <IconButton onClick={()=>{eliminarNotificacion(noti.id)}}><Eliminar color="secondary" /></IconButton>
                                        }
                                    </Grid>
                                </Grid>
                            </Paper>
                        ))
                    }
                </Grid>
            </Paper>
        </div>
    );
}