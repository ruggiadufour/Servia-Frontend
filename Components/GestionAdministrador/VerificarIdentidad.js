import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios'
//Material-UI
import {LinearProgress, Collapse, Hidden, ListItemText, ListItem, List, Paper, Grid, Typography, Button, TextField} from '@material-ui/core/';
import {Clear as Rechazar, Check as Aceptar, ExpandLess, ExpandMore} from '@material-ui/icons/';
import Alerta from '@material-ui/lab/Alert';

//Componentes
import Imagenes from 'react-lightbox-component';
import 'react-lightbox-component/build/css/index.css';

//Estilos
import Estilos from '../Estilos.js'
//Variables globales de la aplicación
import { ObtenerEstadoAplicacion } from '../../Estados/AplicacionEstado'

//Este componente lista todas las solicitudes de verificación de identidad (estas las generan los proveedores
//cuando quieren validar su identidad en el sistema), el administrador va a ver el N° de DNI y las imagenes
//de éste y va a determinar si el usuario es quien dice ser 
export default function VerificarIdentidad() {
    const { state, dispatch } = useContext(ObtenerEstadoAplicacion);
    const classes = Estilos();
    //Variables del componente
    const [usuariosVerificar, setusuariosVerificar] = useState([])
    const [cargando, setcargando] = useState(false);

    //Buscamos todos los usuarios que estan deseando verificar su identidad
    useEffect(()=>{
        setcargando(true)
        let auth = 'Bearer '+state.jwt
        if (state.jwt!==""){            
            axios.get(state.servidor+"/users?espera_verificacion=true",{
                headers: {'Authorization': auth},
            })
            .then(response => {
                setusuariosVerificar(response.data)
                setcargando(false)
            })
            .catch(error => {
                console.log("Un error ha ocurrido al buscar los usuarios a verificar.")
                console.log(error.response)
            }) 
        }
    },[state.jwt])

    //Si el administrador realiza una acción ante una solicitud, entonces esta debe ser sacada de la lista de 
    //solicitudes, el siguiente método hace eso.
    function actualizarUsuario(usuario_id){
        setusuariosVerificar(usuariosVerificar.filter(user => user.id!==usuario_id))
    }
    return (
    <div className={classes.fondo}>
        <Paper elevation={5}  style={{margin:"10px 0px", padding:"20px", width:"90%"}} className="Fondo">
            <Grid container justify="center" spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="h4" component="h1" align="center">
                        Verificar identidades
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    {
                        cargando && <LinearProgress/>
                    }
                    <br/>
                    {
                        !cargando && (usuariosVerificar.length===0 && (<Alerta variant="outlined" severity="info">
                            No hay usuarios que deseen verificar su identidad.
                        </Alerta>))
                    }
                </Grid>
                {
                    usuariosVerificar.map((usuario, i) =>(
                        <Grid item xs={12} key={i}>
                            <Solicitud usuario={usuario} actualizarUsuario={actualizarUsuario}/>
                        </Grid>
                    ))
                }
            </Grid>
        </Paper>
    </div>
  );
}

//Este componente hace referencia a una solicitud, como las solicitudes pueden ser muchas, se separa en un componente aparte
function Solicitud({usuario, actualizarUsuario}) {
    const classes = Estilos()
    return (
        <Paper className={classes.filaPublicacion} variant="outlined" square>
            <Grid container direction="row" alignItems="center">
                <Grid item xs={12}>
                    <Button className={classes.button}>
                        <Typography variant="h5" component="h5" align="left">
                            {`${usuario.nombre} ${usuario.apellido}`}
                        </Typography>
                    </Button>
                    <Button disabled>
                        <Typography variant="h5" component="h2" align="left" >
                            DNI: {usuario.dni}
                        </Typography>
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <DesplegarInformacion usuario={usuario} actualizarUsuario={actualizarUsuario}/>
                </Grid>
            </Grid>
        </Paper>
    );
}

//Cada fila de solicitud, muestra una información reducida para no tener que colapsar la vista con información
//para ver toda la información es necesario desplegarla, el siguiente componente permite eso.
function DesplegarInformacion({usuario, actualizarUsuario}) {
    const classes = Estilos();
    const { state, dispatch } = useContext(ObtenerEstadoAplicacion);
    //Variables del componente
    const [open, setOpen] = useState(false);
    const [imagenes, setimagenes] = useState([]);
    const [cargando, setcargando] = useState(false);
    const [descripcion, setdescripcion] = useState("");
    const [mensaje, setmensaje] = useState("");
    
    //Función que se ejecuta cada vez que se acciona el desplegar información (mostrando u ocultando la información)
    const handleClick = () => {
        setOpen(!open);
    };
    
    //Cuando el administrador decide realizar una acción ante la solicitud, el siguiente método es accionado,
    //el cual genera una notificación al usuario que deseaba verificarse, esta notificación le informa si fue 
    //aceptado o rechazado, tambien se actualiza su estado para que, en el caso de que fuera rechazado pueda
    //volver a enviar la solicitud.
    function enviarDatos(aceptado){
        setcargando(true)
        let auth = 'Bearer '+state.jwt;
        //Generamos una notificación al usuario, indicando si se lo ha verificado o no.
        axios.post(
            state.servidor+"/api/notificaciones/",{
                tipo: 1,
                emisor: state.datosSesion.id,
                receptor: usuario.id,
                solicitud: null,
                datos_notificacion: aceptado?"":descripcion,
                leido: false
            },
            {headers: {'Authorization': auth},})
        .then(response => {

            //Actualizamos los datos al usuario que solicitó la verificación de su identidad.
            axios.put(
                state.servidor+"/users/"+usuario.id,{
                    espera_verificacion: false,
                    identidad_verificada: aceptado
                },{headers: {'Authorization': auth},})
            .then(response => {
                actualizarUsuario(response.data.id)
                setcargando(false)
            })
            .catch(error => {
                console.log("Error, no se ha podido actualizar al usuario.", error.response)
                console.log("Error, no se ha podido actualizar al usuario.")
            })
        })
        .catch(error => {
            console.log("Error, no se ha podido crear la notificacion.", error.response)
            console.log("Error, no se ha podido crear la notificacion.")
        })
        
    }

    //Este metodo sirve para setear un objeto de imagenes para que el componente para mostrar imagenes pueda mostrarlas
    //correctamente
    useEffect(()=>{
        if(usuario.imagenes_dni){
            let img = usuario.imagenes_dni.map((imagen)=>(
                {
                    src: state.servidor+imagen.url,
                    title: imagen.name,
                    description: 'Imagenes de D.N.I.'
                }
            ))
            setimagenes(img)
        }
    },[usuario])

    return (
        <div>
            <ListItem button onClick={handleClick}>
                <ListItemText primary="Desplegar información"/>
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <Grid container direction="row" alignItems="center" justify="center">
                        <Grid item xs={4} sm={12}>
                            <div align="center">
                                <Imagenes images={imagenes}
                                    thumbnailWidth='100px'
                                    thumbnailHeight='100px'
                                />
                            </div>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                id="outlined-basic"
                                name="descripcion"
                                label="Agregar mensaje"
                                multiline variant="outlined"
                                size="medium"
                                fullWidth
                                className={classes.inputAncho}
                                onChange={(e)=>{setdescripcion(e.target.value)}}
                            >
                            </TextField> 
                        </Grid>

                        <Hidden xlDown={mensaje==="" || descripcion!==""}>
                            <Grid item xs={12}>
                                <Typography color="error">
                                    {mensaje}
                                </Typography>
                            </Grid>
                        </Hidden>
                        {
                            cargando && <LinearProgress/>
                        }
                        <div align="center">
                            <Button
                            disabled={cargando}
                            onClick={()=>{enviarDatos(true)}}
                            color="secondary"
                            startIcon={<Aceptar/>}>
                                Validar Identidad
                            </Button>
                            <Button
                            disabled={cargando}
                            onClick={()=>{descripcion===""?setmensaje("Debe escribir un mensaje para rechazar la solicitud."):enviarDatos(false)}}
                            color="error"
                            startIcon={<Rechazar/>}>
                                Rechazar Solicitud
                            </Button>
                        </div>
                    </Grid>
                </List>
            </Collapse>
        </div>
    )
}