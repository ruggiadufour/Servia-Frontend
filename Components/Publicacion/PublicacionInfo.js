import React, {useState, useEffect, useContext} from 'react';
//Material-UI
import {Hidden, Paper, Grid, Typography, Breadcrumbs, Avatar, Tooltip, IconButton} from '@material-ui/core/';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Verificado from '@material-ui/icons/CheckCircleOutline';
import ImageGallery from 'react-image-gallery';
import ReportarPublicacion from './ReportarPublicacion.js'
import Estilos from '../Estilos.js';
import Alerta from '@material-ui/lab/Alert';

import { ObtenerEstadoAplicacion } from '../../Estados/AplicacionEstado'

//Subcomponente que contiene la información de la publicación o parte de la información el perfil de un proveedor
export default function PublicacionInfo({esDePerfil, datosPagina, abrirAlerta}) {
  const classes = Estilos();
  const { state } = useContext(ObtenerEstadoAplicacion);
  const [imagenes, setimagenes] = useState([])
  const [DatosPagina, setDatosPagina] = useState({
    id: null,
    titulo:"",
    precio:"",
    categoria:"",
    servicio:"",
    estrella: 0,
    descripcion:"",
    imagenes:[""],
    pausado: false,
    bloqueado: false,
    Usuario_id: null,
    imagen_perfil: "",
    updated_at: Date.now()
  });

  //Seteamos los datos de la publicación o perfil en el componente
  useEffect(()=>{
    if (state.jwt!=="" || state.publico===true){
      if(datosPagina!==null){
        let img = datosPagina.imagenes.map((imagen)=>{
          return ({
            original: state.servidor+imagen.url,
            thumbnail: state.servidor+imagen.url
          })
        })
        setimagenes(img)
        setDatosPagina({
          id: datosPagina.id,
          titulo: datosPagina.titulo,
          categoria: datosPagina.categoria,
          servicio: datosPagina.servicio,
          estrella: 0,
          descripcion: datosPagina.descripcion,
          precio_estimado: datosPagina.precio_estimado,
          tipo: datosPagina.tipo,
          pausado: datosPagina.pausado,
          imagenes: datosPagina.imagenes,
          bloqueado: datosPagina.bloqueado,
          Usuario_id: datosPagina.Usuario_id,
          imagen_perfil: datosPagina.imagen_perfil,
          updated_at: datosPagina.updated_at
        })
      }
    }
  },[datosPagina, state.jwt, state.publico])

  //Si la publicación lleva mas de 10 dias sin modificarse, se considera como vencida (esto para evitar que ciertas
  //publicaciones se muestren para siempre, en el caso de que el usuario deje de visitar a Servia)
  function publicacionVencida(){
    let hoy = Date.now()
    let modificado = new Date(DatosPagina.updated_at)
    //Calculamos la cantidad de dias que lleva la publicación sin editarse
    let dias = parseInt((hoy-modificado)/1000/60/60/24)
    //Segun el tipo de publicación el tiempo de vencimiento es mayor o menor. Si es una solicitud 15 dias, sino 30
    let diasTipo = DatosPagina.tipo?30:15
    if(dias >diasTipo){
      return (<Alerta className={classes.inputAncho} style={{marginBottom:"10px"}} variant="outlined" severity="info">
        Esta publicación se encuentra vencida, por lo tanto no aparecerá en las búsquedas. Para que vuelva a aparecer su creador debe editarla.
        Tenga en cuenta que las solicitudes se vencen al cabo de 15 días y las publicaciones de proveedores a los 30 días.
        --Si usted quiere contactar a este proveedor/cliente, tenga en cuenta que es posible que no le responda o no le responda a  tiempo, ya que puede estar inactivo en Servia.--
      </Alerta>)
    }
  }
  return (
    <div className={classes.mostrarFlex}>
      <Paper elevation={5} >
        <Grid className={classes.padding} container direction="row" justify="space-between" alignItems="center">
            {
              //En el caso de que el componente fuese utilizado para mostrar datos de un perfil, en DatosPagina.precio_estimado estará la cadena "perfil"
              DatosPagina.pausado && (<Alerta className={classes.inputAncho} style={{marginBottom:"10px"}} variant="outlined" severity="warning">
                {DatosPagina.precio_estimado==="perfil"?"Este proveedor ha pausado sus servicios.":"Esta publicación se encuentra pausada."}
              </Alerta>)
            }
            {
              DatosPagina.bloqueado && (<Alerta className={classes.inputAncho} style={{marginBottom:"10px"}} variant="outlined" severity="error">
                {DatosPagina.precio_estimado==="perfil"?"Este proveedor se encuentra bloqueado.":"Esta publicación se encuentra bloqueada."}
              </Alerta>)
            }
            {
              !esDePerfil && publicacionVencida()
            }
            <Grid item lg={12} hidden={!esDePerfil} align="center" className={esDePerfil?classes.EstiloMovil:classes.EstiloVacio}>
              <Avatar
              alt="Perfil"
              src={DatosPagina.imagen_perfil!==""?state.servidor+DatosPagina.imagen_perfil:state.imagen_predeterminada}
              className={classes.imagenPublicacion} />
            </Grid>

            <Grid item lg={4} md={4} sm={12} hidden={esDePerfil}>
                <Typography variant="h6" component="h3" align="left">
                  {DatosPagina.tipo?"Precio estimado:":"Presupuesto:"} ${DatosPagina.precio_estimado}
                </Typography>
            </Grid>

            <Grid hidden={esDePerfil} item lg={7} md={7} sm={11} align="right">
              <div align="right">
                <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                  <Typography color="inherit">{DatosPagina.categoria}</Typography>
                  {
                    datosPagina.tipo &&
                    <Typography color="inherit">{DatosPagina.servicio}</Typography>
                  }
                </Breadcrumbs>
                  </div>
            </Grid>
            
            {//Si se está logueado y no se está bloqueado, se permite reportar
              state.publico===false && !esDePerfil && !DatosPagina.bloqueado &&
              <Grid item lg={1} md={1} sm={1}>
                <ReportarPublicacion esDePerfil={esDePerfil} solicitud={DatosPagina}/>
              </Grid>
            }
            
            <Grid item xs={esDePerfil?11:12} sm={esDePerfil?11:12}>
              <Typography variant="h5" component="h1" align="left">
                {DatosPagina.titulo}
                {
                  esDePerfil && <Hidden xlDown={!DatosPagina.identidad_verificada}><Tooltip title="Usuario verificado">
                    <IconButton><Verificado color="primary"/></IconButton>
                  </Tooltip></Hidden>
                }
              </Typography>
            </Grid>

            {//Si se está logueado y no se está bloqueado, se permite reportar
              state.publico===false && esDePerfil && !DatosPagina.bloqueado &&
              <Grid item lg={1} md={1} sm={1}>
                <ReportarPublicacion esDePerfil={esDePerfil} solicitud={DatosPagina}/>
              </Grid>
            }
            
            <Grid item xs={12}>
              <Typography variant="body1" component="p" align="justify"> 
                {DatosPagina.descripcion}    
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <ImageGallery items={imagenes.length===0?[{original: state.imagen_predeterminada,thumbnail: state.imagen_predeterminada}]:imagenes}/>
            </Grid>
        </Grid>
      </Paper>
    </div>
  );
}