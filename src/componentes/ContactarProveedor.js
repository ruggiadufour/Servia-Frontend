import React,{useState, useContext, useEffect} from 'react'
import axios from 'axios'
//Material-UI
import {LinearProgress, Avatar, FormControl, Grid, Typography, TextField, Button, Modal, Fade, Backdrop, InputLabel, MenuItem, Select} from '@material-ui/core/';
import {Mail} from '@material-ui/icons';

///Componentes
import AlertaMensaje from './AlertaMensaje.js';
import Estilos from './Estilos.js';
import CategoriaSeleccion from './CategoriaSeleccion.js';

import { ObtenerEstadoAplicacion } from '../Estados/AplicacionEstado'

export function BotonContratar({fijo, esDePerfil, datos}) {
  const classes = Estilos();
  const { state, dispatch } = useContext(ObtenerEstadoAplicacion);
  const [open, setOpen] = React.useState(false);
  const [cargando, setcargando] = React.useState(false);
  const [mensaje, setmensaje] = React.useState("");
  const [abrir, setabrir] = React.useState(false);
  const [categoria, setcategoria] = useState({});
  const [arregloCategorias, setarregloCategorias] = useState([]);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(()=>{
    if (esDePerfil){
      let cat = {}
      let arrCat = []
    datos.servicios.map((servicio)=>{
      if(!cat.hasOwnProperty(servicio.categoria)){
        cat[servicio.categoria] = servicio.categoria
        arrCat.push(servicio.categoria)
      }
    })

    let IDS = ""
    arrCat.map((id)=>{
      if(id!==null){
          IDS+="id_in="+id+"&"
      }
    })
        
    let auth = 'Bearer '+state.jwt;
    if(arrCat.length!==0){
      axios.get(state.servidor+"/api/categorias?"+IDS,{
        headers: {'Authorization': auth},
      })
      .then(response => {
        setarregloCategorias(response.data)
      })
      .catch(error => {
        alert("Un error ha ocurrido al cargar los chats.")
        console.log(error.response)
      }) 
    }
    }
},[datos])


  function enviarContacto(e){
    setcargando(true)
    let auth = 'Bearer '+state.jwt;
    e.preventDefault()

    if(state.jwt!==""){
      let cat_selecc = arregloCategorias.filter(cat_ => cat_.nombre === categoria)

      axios.post(state.servidor+"/api/chats/",{
        noleido_emisor: 0,
        noleido_receptor: 1,
        emisor: state.datosSesion.id,
        receptor: datos.idP,
        solicitud: datos.idS,
        categoria: esDePerfil?cat_selecc[0].id:null,
        peticion: false
      },{
        headers: {'Authorization': auth},
      })
      .then(response => {
        console.log(response.data)

        axios.post(state.servidor+"/api/mensajes/",{
          contenido: mensaje,
          enviado_por: true,
          chat: response.data.id
        },{
          headers: {'Authorization': auth},
        })
        .then(response => {
          console.log(response.data)
          setabrir(true)
          setOpen(false)
          setcargando(false)
        })
        .catch(error => {
          alert("Un error ha ocurrido al cargar los chats.")
          console.log(error.response)
        })
        
      })
      .catch(error => {
        alert("Un error ha ocurrido al cargar los chats.")
        console.log(error.response)
      })
    }else{
      alert("Debes iniciar sesión para poder contactar al proveedor.")
      setcargando(false)
    }
  }

    return (
      <div>
          <div className={fijo?classes.botonFijo:classes.botonNoF}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Mail/>}
              onClick={handleOpen}
            >
              Contactar
            </Button>
        </div>
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
          <Fade in={open} style={{padding:"15px"}}>
            <div className={classes.papelFondo}>
              <div style={{maxWidth:750}} className="Fondo">
              <Grid  container direction="row" justify="center"  spacing={2}>
                  <Grid item xs={12}>
                      <div align="center">
                          <Avatar
                            alt="Perfil"
                            src={datos.imagen_perfil!==null?datos.imagen_perfil:state.imagen_predeterminada}
                            className={classes.imagenPublicacion}/>
                      </div>
                  </Grid>
                  <Grid item xs={12}>
                      <Typography variant="h5" component="h2" align="center" className={classes.form}>
                          {datos.nombre}
                      </Typography>
                  </Grid>

                  <form onSubmit={enviarContacto} className={classes.inputAncho}>
                    <FormControl color="primary" fullWidth>
                      {
                        esDePerfil &&
                        <Grid item xs={12}>
                          
                            <InputLabel id="categoria" variant="filled">Categoría</InputLabel>
                            <Select
                                value={categoria}
                                name="categoria"
                                onChange={(e)=>{setcategoria(e.target.value)}}
                                id="categoria"
                                labelId="categoria"
                                variant="filled"
                                label="Categoría"
                                className={classes.inputAncho}
                                required>
                                {
                                  arregloCategorias.map((categoria, i)=>(
                                    <MenuItem key={i} value={categoria.nombre}>{categoria.nombre}</MenuItem>
                                  ))
                                }
                            </Select>
                        
                        </Grid>
                      }
                    
                      <br/>
                      <Grid item xs={12}>  
                        <TextField
                          onChange={(e)=>{setmensaje(e.target.value)}}
                          className={classes.inputAncho}
                          id="filled-basic"
                          label="Escribe tu mensaje"
                          variant="filled"
                          required
                          multiline
                        />
                      </Grid>

                      <Grid item xs={12} align="center">
                        <br/>
                        {
                          cargando && <LinearProgress/>
                        }
                        <Button
                          disabled={cargando}
                          variant="contained"
                          color="primary"
                          type="submit"
                          >
                            Contactar proveedor
                        </Button>
                      </Grid>
                    </FormControl>
                  </form>
              </Grid>
              </div>
            </div>
          </Fade>
        </Modal>
        <AlertaMensaje mensaje="¡Mensaje enviado con éxito!" setabrir={setabrir} abrir={abrir}/>
      </div>
    );
  }