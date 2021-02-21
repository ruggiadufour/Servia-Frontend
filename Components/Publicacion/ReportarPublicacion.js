import React, {useEffect, useState, useContext} from 'react'
import axios from 'axios'

//Material UI
import {LinearProgress, Tooltip, FormGroup, FormControlLabel, Checkbox, Modal, Backdrop, Fade, Typography, TextField, Button, Hidden} from '@material-ui/core/';
import Reportar from '@material-ui/icons/PriorityHigh';
import Estilos from '../Estilos.js';
import AlertaMensaje from '../AlertaMensaje.js';

import { ObtenerEstadoAplicacion } from '../../Estados/AplicacionEstado'

//Subcomponente utilizado cada vez que se quiere reportar una publicación o un perfil
export default function ReportarPublicacion({esDePerfil, solicitud, abrirAlerta}) {
  const classes = Estilos();
  const { state } = useContext(ObtenerEstadoAplicacion);
  const [open, setOpen] = useState(false);
  const [motivos, setmotivos] = useState([{id: null, nombre: "",tipo: false}])
  const [motivosSeleccionados, setmotivosSeleccionados] = useState([])
  const [descripcion, setdescripcion] = useState("")
  const [abrir, setabrir] = useState(false)
  const [cargando, setcargando] = useState(false)
  const [mensaje, setmensaje] = useState(false);

  //Ejecutados cuando se abre o se cierra la ventana modal
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setmotivosSeleccionados([])
    setOpen(false);
  };

  //Función ejecutada cada vez que se selecciona un motivo
  function seleccionarMotivo(Motivo){
    if(mensaje===true)
      setmensaje(false)
    let esta = motivosSeleccionados.some((motivo) => motivo.id===Motivo.id)
    //Si no está, se lo agrega al arreglo, caso contrario se lo quita
    if(!esta){
      setmotivosSeleccionados((arreglo)=>[...arreglo, {id:Motivo.id, nombre:Motivo.nombre}])
    }else{
      setmotivosSeleccionados(motivosSeleccionados.filter((motivo)=>motivo.id!==Motivo.id))
    }
  }

  //Traemos los motivos existentes en el sistema
  useEffect(()=>{
    if(state.jwt!=="" || state.publico===true){
      axios.get(state.servidor+"/api/motivos?tipo="+esDePerfil)
      .then(response => {
        setmotivos(response.data)
      })
      .catch(error => {
        console.log("Un error ha ocurrido al cargar las motivos.")
        console.log(error.response)
      })      
    }
  },[state.jwt, state.publico])

  //Función que se utiliza para ver si hay algún reporte ya hecho a esa publicación o perfil
  function ComprobarReporte(reporte){
    let auth = 'Bearer '+state.jwt;
    //Si hay algún motivo seleccionado...
    if(motivosSeleccionados.length!==0){
      //Si existe ya algún reporte creado a la publicación o al perfil...
      if(reporte.length!==0){
        let fecha = new Date()
        let reporte_conjunto = reporte[0]
        //Concatenamos la descripción del reporte viejo con el del nuevo reporte
        let _descripcion = descripcion.length!==0?descripcion:"El usuario no ha proporcionado información adicional."
        let descripcion_="##Nuevo reporte (Motivos:"+
        motivosSeleccionados.map(motivo=>(" "+motivo.nombre))+") del día "
        +fecha.getDate()+"/"+(fecha.getMonth()+1)+"/"+fecha.getFullYear()+": "+_descripcion
        //Modificamos el reporte
        axios.put(state.servidor+"/api/reportes/"+reporte_conjunto.id,{
          descripcion: reporte_conjunto.descripcion+descripcion_
        },
          {headers: {'Authorization': auth},
        })
        .then(response => {
          setmensaje(false)
          handleClose()
          setabrir(true)
          setcargando(false)
          setmotivosSeleccionados([])
          setdescripcion("")
        })
        .catch(error => {
          console.log("Un error ha ocurrido al cargar las motivos.")
          console.log(error.response)
        })
      }else{
        //Si no existe ya algún reporte creado a la publicación o al perfil, creamos el reporte
        axios.post(state.servidor+"/api/reportes",{
          motivos: motivosSeleccionados.map(motivo_=>(motivo_.id)),
          Solicitud_id: esDePerfil?null:solicitud.id,
          Usuario_id: esDePerfil?solicitud.id:solicitud.Usuario_id.id,
          accion: false,
          estado: 0,
          descripcion: descripcion
        },{
          headers: {'Authorization': auth},
        })
        .then(response => {
          console.log(response.data)
          setmensaje(false)
          handleClose()
          setabrir(true)
          setcargando(false)
          setmotivosSeleccionados([])
          setdescripcion("")
        })
        .catch(error => {
          console.log("Un error ha ocurrido al cargar las motivos.")
          console.log(error.response)
        })
      }
    }else{
      setcargando(false)
      setmensaje(true)
    }
  }

  //Función que se ejecuta al enviar el reporte
  function EnviarReporte(){
    setcargando(true)
    let auth = 'Bearer '+state.jwt;
    //Si el reporte es a una publicación, entonces se trae el reporte (si es que existe) que coincida con el id de la publicación y su estado sea "En espera"
    if(!esDePerfil && solicitud.id!==null){
      axios.get(state.servidor+"/api/reportes?Solicitud_id="+solicitud.id+"&estado=0"
        ,{headers: {'Authorization': auth},
      })
      .then(response => {
        ComprobarReporte(response.data)
      })
      .catch(error => {
        console.log("Un error ha ocurrido al cargar las motivos.")
        console.log(error.response)
      })
    }
    //Si el reporte es a un perfil, entonces se trae el reporte (si es que existe) que coincida con el id del usuario y su estado sea "En espera"
    if(esDePerfil && solicitud.id!==null){
      axios.get(state.servidor+"/api/reportes?Usuario_id="+solicitud.id+"&estado=0"
        ,{headers: {'Authorization': auth},
      })
      .then(response => {
        let reportes_solicitud_null = response.data.filter((reporte) => reporte.Solicitud_id===null)
        ComprobarReporte(reportes_solicitud_null)
      })
      .catch(error => {
        console.log("Un error ha ocurrido al cargar las motivos.")
        console.log(error.response)
      })
    }
  }


  return (
    <div>
      {abrir && <AlertaMensaje mensaje="¡Se ha enviado su reporte correctamente!" abrir={abrir} setabrir={setabrir}/>}
      <Tooltip title={esDePerfil?"Reportar proveedor de servicios":"Reportar publicación"}>
        <Button
            onClick={handleOpen}
        ><Reportar/>
        </Button>
      </Tooltip>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.mostrarFlex}
        open={open}
        onClose={handleClose}
        closeAfterTransition={true}
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.papelFondo}>
            <Typography variant="h5" component="h2" align="center">
                Seleccione los motivos:
            </Typography>
            <FormGroup required>
            {
              motivos.map((motivo,i)=>(
                <FormControlLabel
                  key={i}
                  control={
                  <Checkbox
                    variant="error"
                    onChange={()=>{seleccionarMotivo(motivo)}}
                  />
                  }
                  label={motivo.nombre}
                />
              ))
            }
            </FormGroup>

            <Hidden xlDown={!mensaje || cargando}>
              <Typography color="error">
                Debe seleccionar un motivo.
              </Typography>
            </Hidden>

            <TextField
            className={classes.inputAncho}
            onChange={(e)=>{setdescripcion(e.target.value)}}
            value={descripcion}
            id="filled-basic"
            label="Informacion adicional"
            variant="filled"
            multiline/>

            <br/>
            {cargando && <LinearProgress color="secondary"/>}
            
            <Button
            disabled={cargando}
            className={classes.inputAncho}
            style={{marginTop:10}}
            size="large"
            variant="contained"
            color="primary"
            onClick={EnviarReporte}>Enviar</Button>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}