import React, {useEffect,useState, useContext} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios'

//Material-UI
import {LinearProgress, Paper, List, ListItem, Collapse, ListItemText, Grid, Typography, Button, Tooltip, TextField, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel} from '@material-ui/core';
import {ExpandLess, ExpandMore}  from '@material-ui/icons';
import Ojo from '@material-ui/icons/Visibility';
import Flechita from '@material-ui/icons/ArrowForwardIos';
import Aceptar from '@material-ui/icons/Check';
import Rechazar from '@material-ui/icons/Clear';
import Alerta from '@material-ui/lab/Alert';

//Variables globales de la aplicación
import { ObtenerEstadoAplicacion } from '../../Estados/AplicacionEstado'
import Estilos from '../Estilos.js';

//Este es un subcomponente que se utiliza en PestanaReporte.js, se utiliza para administrar los reportes de publicaciones
//y de perfiles. Solo un administrador tiene acceso a este componente.
//Aquí se visualizaran 3 secciones de reportes: reportes nuevos, son reportes que pueden ser administrados (aceptados
//o rechazados); reportes en espera, estos reportes ya han sido administrados, y se encuentran en espera de que el
//usuario modifique la publicación o perfil; historial de reportes, estos reportes ya han sido conluidos, aquí se
//muestra información de la acción que han tomado los administradores
export default function GestionarReportes({estadoReporte, reportes, modificarReporte, cargando}) {
    const classes = Estilos();
    const [titulo, setTitulo] = useState("");
    
    useEffect(()=>{
        //Dependiendo de si accedemos a los reclamos en espera, al historial de reclamos o a los reclamos nuevos, se muestra el título correspodiente
        if(estadoReporte===0)
            setTitulo("Reportes pendientes de moderación");
        else if(estadoReporte===1)
            setTitulo("Reportes en espera");
        else
            setTitulo("Historial de reportes");
    },[])
  
  return (
    <div className={classes.fondo} className="Fondo">
      <Paper elevation={5}>
        <Grid className={classes.filaPublicacion}  container justify="center">
            <Grid item xs={12}>
                <Typography variant="h4" component="h1" align="center">
                    {titulo}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <br/>
                {
                    !cargando && reportes.length===0 && (<Alerta variant="outlined" severity="info">
                    No hay reportes para mostrar.
                    </Alerta>)
                }  
                {
                    reportes.map((datos, i) =>
                        <Reporte key={i} datos={datos} modificarReporte={modificarReporte}/>
                    )
                }
            </Grid>
        </Grid>
      </Paper>
    </div>
  );
}


function Reporte({datos, modificarReporte}) {
    const classes = Estilos();
    const { state, dispatch } = useContext(ObtenerEstadoAplicacion);
    let color;
    //Cada reporte tiene un color asignado según el estado en el que se encuentra. 
    switch (datos.estado) {
        case -1:
            color = "#5d9b9b"
            break;
        case 0:
            color = "gray"
            break;
        case 1:
            color = "yellow"
            break;
        case 2:
            color = "#FFDED3"
            break;
        case 3:
            color = "#D6FFD3"
            break;
    }
    return (
        <Paper className={classes.filaPublicacion} className="Fondo" variant="outlined" square>
            <Grid container direction="row" justify="center" style={{padding:"15px"}}>
                <Grid item xs={12} lg={9} md={9} sm={12}>
                    <Button disabled>
                        <Typography color="secondary" variant="h5" component="h2" align="left" >
                            {datos.Solicitud_id===null?"Reporte al usuario ":datos.Solicitud_id.titulo}
                        </Typography>
                    </Button>

                    {
                        datos.Solicitud_id!==null &&
                        <Link to={state.ruta+"/publicacion/"+datos.Solicitud_id.id} className={classes.EstiloLink}>
                            <Tooltip title="Vista previa">
                                <Button><Ojo color="primary" /></Button>
                            </Tooltip>
                        </Link>
                    }
                        
                    <Button disabled>
                        <Flechita/>
                    </Button>
                  
                    <Link to={state.ruta+"/perfil-proveedor/"+datos.Usuario_id.id} className={classes.EstiloLink}>
                        <Button className={classes.button}>
                            <Typography variant="h6" component="h5" align="left">
                                {`${datos.Usuario_id.nombre} ${datos.Usuario_id.apellido}`}
                            </Typography>
                        </Button>
                    </Link>
                </Grid>

                <Grid item xs={12} lg={3} md={3} sm={12}>
                    <Typography variant="h6" component="h5" align="right">
                        {datos.created_at.split("T")[0]}
                    </Typography>
                </Grid>
                
                
                <Grid item xs={12}>
                    <Typography variant="h6" component="h5" align="left">
                        Motivos del reporte:
                    </Typography>
                </Grid>
                
                <Grid container direction="row" justify="center">
                    {
                        datos.motivos.map((motivo, i)=>(
                            <Grid key={i} item xs={6} sm={3} md={3} lg={3}>
                                <Typography variant="h6" component="h3" align="center">
                                    {
                                        motivo.nombre
                                    }
                                </Typography>
                            </Grid>
                        ))
                    }
                </Grid>
                
                <Grid item xs={12}>
                    <DesplegarInformacion datos={datos} modificarReporte={modificarReporte}/>
                </Grid>
            </Grid>
        </Paper>
    );
}

  
function DesplegarInformacion({datos, modificarReporte}) {
    const classes = Estilos();
    const { state, dispatch } = useContext(ObtenerEstadoAplicacion);
    //Variables del componente
    const [open, setOpen] = useState(false);
    const [accion, setaccion] = useState(false);
    const [cargando, setcargando] = useState(false);

    //Función que se ejecuta cada vez que se despliega la información, sirve para mostrar los elementos desplegados
    const handleClick = () => {
        setOpen(!open);
    };

    //Funcion que se ejecuta cada vez que un administrador acepta o rechaza un reporte
    function enviarDatos(descripcion, aceptado){
        setcargando(true)
        let auth = 'Bearer '+state.jwt;
        let estado = 2
        let datosNoti = "Su "+(datos.Solicitud_id!==null?"publicación":"perfil")+" tiene una sugerencia de modificación. \nMensaje de la administración: "+descripcion
        
        /**
         * estado:-1 ->Reporte respondido por el usuario
         * estado: 0 ->Reporte esperando a ser atendido
         * estado: 1 ->Reporte en espera, el proveedor debe modificar su perfil/publicación
         * estado: 2 ->Reporte rechazado
         * estado: 3 ->Reporte concluido
         */

        //Si se acepta el reporte
        if(aceptado){
            //Si la acción tomada es pausar la publicación o continuar con la pausa
            if(accion){
                //El estado se setea en "en espera de respuesta"
                estado = 1
                datosNoti = datos.Solicitud_id!==null?
                "Su publicación ha sido pausada por un administrador, deberá modificarla para que vuelva a estar disponible al público. \nMensaje de la administración: "+descripcion:
                "Su perfil ha sido bloqueado por un adminitrador, deberá modificarlo para que vuelva a estar disponible al público. \nMensaje de la administración: "+descripcion
                //Bloqueamos la publicación, si es que ya no lo está
                if(datos.estado!==-1)
                    cambiarVariableBloqueado(datos, true)
            //Si no se pausa o se despausa
            }else{
                //El estado se setea en "concluído"
                estado = 3
                //Si el estado del reporte era "respondido", se desbloquea la publicación
                if(datos.estado===-1){
                    cambiarVariableBloqueado(datos, false)
                    aceptado = true
                    datosNoti = datos.Solicitud_id!==null?"¡Su publicación se encuentra nuevamente disponible!":"¡Su perfil se encuentra nuevamente disponible!"
                }
            }
        }
        
        //Si aceptado es true, entonces el reporte es aceptado y se le notifica al usuario
        if(aceptado===true){
            axios.post(
                state.servidor+"/api/notificaciones/",{
                    tipo: 0,
                    emisor: state.datosSesion.id,
                    receptor: datos.Usuario_id.id,
                    solicitud: datos.Solicitud_id!==null?datos.Solicitud_id.id:null,
                    datos_notificacion: datosNoti,
                    leido: false
                },{
                    headers: {'Authorization': auth},
            })
            .then(response => {
                actualizarReporte(response.data.id, estado)
            })
            .catch(error => {
                console.log("Error, no se ha podido crear la notificacion.", error.response)
                setcargando(false)
            })
        }else{
            //Si aceptado es false, entonces el reporte es descartado, luego se actualiza el estado del reporte
            actualizarReporte(null, estado)
        }
    }

    //Función que se ejecuta cuando se desea actualizar la información de un determinado reporte
    function actualizarReporte(notificacion, estado){
        let auth = 'Bearer '+state.jwt;
        //Se establecen los datos actualizados
        axios.put(
            state.servidor+"/api/reportes/"+datos.id,{
                accion: accion,
                estado: estado,
                notificacion: notificacion,
                Administrador_id: state.datosSesion.id
            },{headers: {'Authorization': auth},
        })
        .then(response => {
            setcargando(false)
            /*El siguiente método actualiza el arreglo de objetos de reporte del componente pestanaReportes, 
            con el objetivo de que el reporte cambie de estado y se muestre en su respectivo tab*/
            modificarReporte(response.data)
        })
        .catch(error => {
            console.log("Error, no se ha podido crear el reporte.", error.response)
            console.log("Error, no se ha podido crear el reporte.")
            setcargando(false)
        })
    }
    
    //Cuando un administrador decide pausar una publicación o despausar, entonces se debe actualizar la información
    //de esa publicación.
    function cambiarVariableBloqueado(datos, bool){
        let auth = 'Bearer '+state.jwt;
        //Si el reporte no tiene información de solicitud, significa que es un reporte a un perfil, por lo que
        //debemos establecer la ruta y el id respectivo a cada uno de los casos
        let ruta = datos.Solicitud_id===null?"users/":"api/solicitud/"
        let _id = datos.Solicitud_id===null?datos.Usuario_id.id:datos.Solicitud_id.id

        //Se actualizan los datos
        axios.put(
            state.servidor+"/"+ruta+_id,{
                bloqueado: bool,
            },{headers: {'Authorization': auth},})
        .then(response => {
            setcargando(false)
        })
        .catch(error => {
            console.log("Error, no se ha podido bloquear.", error.response)
            console.log("Error, no se ha podido bloquear .")
            setcargando(false)
        })
    }

    return (
        <div>
            <ListItem button onClick={handleClick}>
                <ListItemText primary="Desplegar información"/>
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <hr/>
                    <Grid item xs={12}>
                        {
                            datos.descripcion.split("##").map((mensaje, i)=>(
                                <Typography key={i} align="justify"> 
                                    {mensaje}
                                </Typography>
                            ))
                        } 
                    </Grid>
                    <hr/>
                    
                    {
                        datos.estado<=0 && <FormControl component="fieldset" align="left">
                            <FormLabel required component="legend">Acción</FormLabel>
                                <RadioGroup disabled={datos.estado>0} row aria-label="Accion" value={accion} onChange={(e)=>{setaccion(!accion)}}>
                                    <FormControlLabel
                                    value="true"
                                    checked={accion}
                                    control={<Radio />}
                                    label={datos.estado===-1?(datos.Solicitud_id!==null?"Continuar con la publicación bloqueada":"Continuar con el perfil bloqueado"):
                                    (datos.Solicitud_id!==null?"Bloquear publicación":"Bloquear perfil")}/>
                                    <FormControlLabel
                                    value="false"
                                    checked={!accion}
                                    control={<Radio />}
                                    label={datos.estado===-1?(datos.Solicitud_id!==null?"Desbloquear publicación":"Desbloquear perfil"):("No hacer nada")} />
                                </RadioGroup>
                        </FormControl>
                    }
                    {
                        datos.estado>0 && <Typography variant="h6" component="h5" align="left">
                            {datos.accion?(datos.Solicitud_id!==null?"La publicación fue bloqueada":"El perfil fue bloqueado"):
                            (datos.Solicitud_id!==null?"No se bloqueó la publicación":"No se bloqueó el perfil")}
                        </Typography>
                    }
                    {
                        cargando && <LinearProgress />
                    }
                    <div hidden={datos.estado>0}>
                        {
                            datos.estado===-1 && <ParteEspera_Historial datos={datos.notificacion}/>
                        }
                        <ParteNuevos enviarDatos={enviarDatos} datos={datos} cargando={cargando} esRespuesta={datos.estado===-1}/>
                    </div>
                    
                    <div hidden={datos.estado<=0}>
                        <ParteEspera_Historial datos={datos.notificacion}/>
                    </div>
                </List>
            </Collapse>
        </div>
    )
}

//Componente que se utiliza para mostrar los reportes de la sección "Gestionar nuevos reportes"
const ParteNuevos = ({enviarDatos, datos, cargando, esRespuesta}) =>{
    const [descripcion, setdescripcion] = useState("")
    return(
        <div>
            <Grid item xs={12}>
                <TextField
                onChange={(e)=>{setdescripcion(e.target.value)}}
                value={descripcion}
                id="outlined-basic"
                label="Agregar mensaje"
                multiline variant="outlined"
                size="medium"
                fullWidth/> 
            </Grid>

            <div align="center">
                <Button disabled={cargando} startIcon={<Aceptar/>} onClick={()=>{enviarDatos(descripcion, true)}}>
                    {esRespuesta?"Confirmar acción":"Aceptar reporte"}
                </Button>
                {
                    datos.estado!==-1 &&
                    <Button disabled={cargando} color="secondary" startIcon={<Rechazar/>} onClick={()=>{enviarDatos(descripcion, false)}}>
                        Descartar reporte
                    </Button>
                }
            </div>
        </div>
    )
}

//Componente que se utiliza para mostrar los reportes de la sección "Reportes en espera"
const ParteEspera_Historial = ({datos}) =>{
    return(
        datos.map((notif, i)=>(
            <div key={i}>
                <hr/>
                <Grid container justify="center">
                    <Grid item xs={9}>
                        <Typography color="secondary" variant="h5" component="h4" align="left" >
                            Mensaje del administrador
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography variant="h6" component="h5" align="right">
                            {notif.created_at.split("T")[0]}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        {notif.datos_notificacion}
                    </Grid>
                </Grid>
            </div>
        ))
    )
}