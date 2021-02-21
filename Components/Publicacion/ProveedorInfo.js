import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios'
import { Link  } from 'react-router-dom';
//Material-UI
import {Hidden, Paper, Grid, Typography, Avatar, Divider, Button, ListSubheader, List, ListItem, ListItemText, Tooltip, Collapse, IconButton} from '@material-ui/core';
import {Phone as PhoneIcon, FileCopy as Copiar, ExpandLess, ExpandMore, CheckCircleOutline as Verificado} from '@material-ui/icons/';
import Alerta from '@material-ui/lab/Alert';

import Estilos from '../Estilos.js';
import AlertaMensaje from '../AlertaMensaje.js';

import { ObtenerEstadoAplicacion } from '../../Estados/AplicacionEstado'

//Subcomponente que contiene la información del perfil de un proveedor
export default function ProveedorInfo({esDePerfil, datosPerfil}) {
  const classes = Estilos();
  const { state } = useContext(ObtenerEstadoAplicacion);
  const [categorias, setcategorias] = useState([])
  const [copiado, setcopiado] = useState(false)

  const [DatosPerfil, setDatosPerfil] = useState({
    id: null,
    descripcion:"",
    titulo:"",
    identidad_verificada: false,
    telefono: "",
    mostrar_telefono: false,
    servicios: [],
    pausado: false,
    bloqueado: false,
  })

  //Seteamos los datos del perfil del proveedor
  useEffect(()=>{
  if (state.jwt!=="" || state.publico===true)
    if(datosPerfil!==null){
      setDatosPerfil(datosPerfil)
      buscarCategorias(datosPerfil)
    }
  },[datosPerfil])

  //Función que trae las categorías que el proveedor tiene asociadas a los servicios que ofrece
  function buscarCategorias(perfil){
    let ids_categorias = perfil.servicios.map((servicio) =>(servicio.categoria))
    let ids_consultas = ""

    ids_categorias.map((id)=>{
      ids_consultas+="id_in="+id+"&"
    })

    if (ids_consultas!==""){
      axios.get(
        state.servidor+"/api/categorias?"+ids_consultas
      )
      .then(response => {
        setcategorias(response.data)
      })
      .catch(error => {
        console.log("Un error ha ocurrido al cargar las categorías.")
        console.log(error.response)
      }) 
    }
  }

  function copiarAlPortapapeles(telefono) {
    // Crea un campo de texto "oculto"
    var aux = document.createElement("input");
    // Asigna el contenido del elemento especificado al valor del campo
    aux.setAttribute("value", telefono);
    // Añade el campo a la página
    document.body.appendChild(aux);
    // Selecciona el contenido del campo
    aux.select();
    // Copia el texto seleccionado
    document.execCommand("copy");
    // Elimina el campo de la página
    document.body.removeChild(aux);
    setcopiado(true)
  }

  return (
    <div className={classes.proveedorSticky}>
      <Paper elevation={5}>
        <Grid className={classes.padding} container direction="row" justify="space-between" alignItems="center">
            <Grid item xs={12} className={esDePerfil?classes.EstiloPC:classes.EstiloVacio}>
              <Avatar
              alt="Perfil"
              src={DatosPerfil.imagen_perfil!==null?state.servidor+DatosPerfil.imagen_perfil:state.imagen_predeterminada}
              className={classes.imagenPublicacion}/>
            </Grid>

            <Grid item xs={12} hidden={esDePerfil}>
              <Typography variant="h5" component="h3" align="center">
                <Link to={state.ruta+"/perfil-proveedor/"+DatosPerfil.id} className={classes.EstiloLink}>
                  {DatosPerfil.titulo}
                  <Hidden xlDown={!DatosPerfil.identidad_verificada}>
                    <Tooltip title="Usuario verificado">
                      <IconButton><Verificado color="primary"/></IconButton>
                    </Tooltip>
                  </Hidden>
                </Link>
              </Typography>
           </Grid>

           <Grid item xs={12} hidden={esDePerfil}>
           {
              DatosPerfil.pausado && (<Alerta className={classes.inputAncho} style={{marginBottom:"10px"}} variant="outlined" severity="warning">
                Este proveedor ha pausado sus servicios.
              </Alerta>)
            }
            {
              DatosPerfil.bloqueado && (<Alerta className={classes.inputAncho} style={{marginBottom:"10px"}} variant="outlined" severity="error">
                Este proveedor se encuentra bloqueado.
              </Alerta>)
            }
            </Grid>

           <Grid item xs={12} hidden={esDePerfil}>
              <Divider/> 
              <Typography variant="body1" component="p" align="justify"> 
                {DatosPerfil.descripcion}
              </Typography>
           </Grid>
            
           <Grid item xs={12}>
                <Divider/> 
                <List
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={
                    <ListSubheader component="div" id="nested-list-subheader">
                        Servicios ofrecidos
                    </ListSubheader>
                }
                >
                    <Divider/>
                    {
                      categorias.map((categoria, i)=>(
                        <Categorias key={i} categoria={categoria} DatosPerfil={DatosPerfil} /> 
                      ))
                    }
                    <Divider/>
                </List>         
           </Grid>
           <Hidden xlDown={!DatosPerfil.mostrar_telefono}>
            {
              DatosPerfil.telefono.length!==0 &&
              <Grid item xs={12}>
                <a className={classes.EstiloLink} href={"tel:"+DatosPerfil.telefono}>
                  <Button startIcon={<PhoneIcon/>}>
                    {DatosPerfil.telefono}
                  </Button>
                </a>
                <Tooltip title="Copiar">
                  <IconButton onClick={()=>copiarAlPortapapeles(DatosPerfil.telefono)}><Copiar/></IconButton>
                </Tooltip>
              </Grid>
            }
           </Hidden>
        </Grid>
      </Paper>
      <AlertaMensaje mensaje={"Copiado al portapapeles"} abrir={copiado} setabrir={setcopiado}/>

    </div>
  );
}

//Subcomponente que muestra los datos de la categoría y servicios que ofrece el proveedor
function Categorias({categoria, DatosPerfil}) {
    const [open, setOpen] = useState(true);

    const handleClick = () => {
        setOpen(!open);
    };
    return (
        <div>
            <ListItem button onClick={handleClick}>
                <ListItemText primary={categoria.nombre}/>
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <Divider/>
                      {
                        DatosPerfil.servicios.map((servicio, i) => {
                          if(servicio.categoria===categoria.id){
                            return (
                              <Typography key={i} variant="h6" component="h5" align="left">
                                {servicio.nombre}
                              </Typography>
                            )
                          }
                        }
                        )
                      }
                    <Divider/>
                </List>
            </Collapse>
        </div>
    )
}