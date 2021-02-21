import React,{useState, useEffect, useContext} from 'react';
import axios from 'axios'

//Material UI
import {LinearProgress, Avatar, Link, Divider, Button, Grid, Backdrop, Modal, Fade, Typography, TextField, FormControl, Hidden } from '@material-ui/core/';

//Componentes
import Estrellas from '../Estrellas.js';
import AlertaMensaje from '../AlertaMensaje.js';
import Estilos from '../Estilos.js'
import SeleccionarServicio from '../SeleccionarServicio.js';
//Variables de estado global del sistema
import { ObtenerEstadoAplicacion } from '../../Estados/AplicacionEstado'
export default function RealizarOpinion({eliminarNotificacion, datos}) {
  const classes = Estilos();
  const { state, dispatch } = useContext(ObtenerEstadoAplicacion);
  //Variables del componente
  const [open, setOpen] = React.useState(false);
  const [abrir, setabrir] = React.useState(false);
  const [valorEstrella, setValorEstrella] = useState(0);
  const [titulo, settitulo] = useState("");
  const [descripcion, setdescripcion] = useState("");
  const [servicios, setservicios] = useState([]);
  const [serviciosSeleccionados, setserviciosSeleccionados] = useState([]);
  const [cargando, setcargando] = useState(false);
  const [mensaje, setmensaje] = useState(false);

  //Funciones que permite abrir o cerrar la ventana modal
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  //
  //Cada vez que el usuario selecciona una valoración (estrellas), se ejecuta el siguiente método que obtiene el valor seleccionado
  const cambiarValor = (e) =>{
    setValorEstrella(Number(e.target.value));
  }

  //La siguiente función sirve para obtener los servicios al cual el usuario va a realizar la reseña
  //si el cliente contactó por medio de una solicitud, sacamos el id de la categoria por medio de la solicitud,
  // si lo hizo por medio del perfil del proveedor, entonces el id de la categoría va a estar en datos_notificación
  useEffect(() => {
    setValorEstrella(0)
    //El objetivo de todo esto es que el usuario pueda seleccionar servicios adicionales, en el caso de que el proveedor los haya hecho
    let _id = datos.solicitud!==null?datos.solicitud.Categoria_id:Number(datos.datos_notificacion.split("_")[0])
    let auth = 'Bearer '+state.jwt;
    
    //Si el contacto es por solicitud, podemos saber cual va a ser el servicio inicial
    let seleccInic = datos.solicitud!==null?[datos.solicitud.Servicio_id]:[]
    setserviciosSeleccionados(seleccInic)
    
    //Buscamos todos los servicios según la categoría
    axios.get(state.servidor+"/api/servicios?categoria="+_id,{
      headers: {'Authorization': auth},
    })
    .then(response => {
      let servicios_ = response.data.map(serv=>{
        serv["seleccionado"] = false
        return serv
      })
      setservicios(servicios_)
    })
    .catch(error => {
      console.log("Un error ha ocurrido al buscar los servicios.")
      console.log(error.response)
    }) 
  },[datos])

  //Funcion de ayuda para la seleccion de servicios
  function ayudaSelec(servicio){
    let ayuda = datos.solicitud===null?true:false
    if(ayuda){
      return true
    }else{
      if(datos.solicitud.Servicio_id!==servicio.id
      ){
        return true
      }else{
        return false
      }
    }
  }

  //El usuario genera la opinión del servicio dado por el proveedor
  function enviarOpinion(e){
    e.preventDefault()
    let auth = 'Bearer '+state.jwt;    
    //Si no hay servicios seleccionados, entonces el usuario no puede realizar la opinión
    if(serviciosSeleccionados.length!==0){
      setcargando(true)

      //Se establece toda la información de la reseña
      axios.post(
        state.servidor+"/api/resenas/",{
        titulo: titulo,
        descripcion: descripcion,
        recomendacion: Number(valorEstrella),
        votos_positivos: 0,
        votos_negativos: 0,
        proveedor: datos.emisor.id,
        servicios: serviciosSeleccionados.length!==0?serviciosSeleccionados:null,
        },
        {headers: {'Authorization': auth},})
      .then(response => {
        //Se elimina la notificación para que el usuario no pueda volver a realizar la reseña
        eliminarNotificacion(datos.id)
        setcargando(false)
        setabrir(true)
        setOpen(false)
    })
      .catch(error => {
        console.log("Error, no se ha podido crear la reseña.", error.response)
        console.log("Error, no se ha podido crear la reseña.")
    })
    }else{
      setmensaje(true)
    }
  }

  //Cada vez que se selecciona un servicio o se lo saca, debemos actualizar la lista de servicios seleccionados 
  function seleccionarServicio(servicio_){
    if (mensaje)
      setmensaje(false)
    let yaEsta = serviciosSeleccionados.some(serv=>(serv === servicio_.id))
    if(!yaEsta){
      setserviciosSeleccionados([...serviciosSeleccionados, servicio_.id])
    }else{
      setserviciosSeleccionados(serviciosSeleccionados.filter(srv_ => srv_!==servicio_.id))
    }
  }

  return (
    <div>
        <Button
            variant="contained"
            color="primary"
            onClick={handleOpen}
        >
        Realizar reseña
      </Button>

      <AlertaMensaje mensaje="¡Reseña enviada!" setabrir={setabrir} abrir={abrir}/>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.mostrarFlex}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        
      >
        <Fade in={open}>
          <div >
            <Grid className={classes.papelFondo} style={{maxWidth: "500px"}} container direction="row" justify="space-between" alignItems="center">
              <form onSubmit={enviarOpinion}>
                <FormControl >
                  <Grid item xs={12}>
                    <div align="center">
                        <Avatar
                        alt="Nombre proveedor"
                        src={datos.emisor.imagenes_proveedor.length!==0?state.servidor+datos.emisor.imagenes_proveedor[0].url:""}
                        className={classes.imagenPublicacion}/>
                    </div>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h5" component="h2" align="center" className={classes.form}>
                      {`${datos.emisor.nombre} ${datos.emisor.apellido}`}
                    </Typography>
                  </Grid>

                    <Typography variant="h5" component="h3" align="center" className={classes.form}>
                      {datos.solicitud!==null?"Publicación: ":"Categoría: "} 
                      {datos.solicitud!==null?datos.solicitud.titulo:datos.datos_notificacion.split("_")[1]}
                    </Typography>

                    <TextField
                      onChange={(e)=>{settitulo(e.target.value)}}
                      className={classes.inputAncho}
                      id="filled-basic"
                      label="Título de la reseña"
                      variant="filled"
                      required/>
                    <Divider/>
                    <br/>
                    <TextField
                      onChange={(e)=>{setdescripcion(e.target.value)}}
                      className={classes.inputAncho}
                      id="filled-basic"
                      label="Descripción (opcional)"
                      variant="filled"
                      multiline/>
                    <br/>

                    {
                      servicios.length!==0 &&
                      <Grid container spacing={2} justify="space-around">
                        <Grid item xs={12}>
                          <Typography variant="subtitle1" component="h4" align="center" className={classes.form}>
                            {datos.solicitud!==null?"Si el proveedor te ha ofrecido otros servicios, puedes seleccionarlos aquí: ":"Selecciona los servicios llevados a cabo: "} 
                          </Typography>
                        </Grid>
                        {
                          servicios.map((servicio,k) => (
                            ayudaSelec(servicio) &&
                            <Grid item xs={6} sm={4} md={3} lg={2} key={k}>
                              <SeleccionarServicio
                                servicio={servicio} 
                                agregarSeleccionado={(valor)=>{
                                  seleccionarServicio(servicio)
                                  servicio.seleccionado = valor
                                }}
                              />
                            </Grid>
                          ))
                        }
                      </Grid>
                    }

                    <Typography variant="h5" component="h4" align="center" className={classes.form}>
                        ¡Valora el servicio brindado!
                    </Typography>
                    <Estrellas valor={valorEstrella} cambiarValor={cambiarValor} clickeable={true}/>

                    <Hidden xlDown={!mensaje || cargando}>
                      <Typography color="error">
                        Debes seleccionar al menos un servicio.
                      </Typography>
                    </Hidden>
                    
                    {cargando && <LinearProgress/>}

                    <Button
                      type="submit"
                      disabled={Number(valorEstrella)===0 || cargando}
                      variant="contained"
                      color="primary"
                    >
                      Enviar reseña
                    </Button>
                </FormControl>
                </form>
            </Grid>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}