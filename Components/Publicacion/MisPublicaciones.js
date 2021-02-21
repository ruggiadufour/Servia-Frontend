import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios'
//Material-UI
import { Typography, Paper, Container } from '@material-ui/core';
import Alerta from '@material-ui/lab/Alert';
import Cargando from '@material-ui/core/LinearProgress';

import FilaPublicacion from '../Categoria/FilaPublicacion.js';
import Estilos from '../Estilos.js';
import { ObtenerEstadoAplicacion } from '../../Estados/AplicacionEstado'

//Este componente nos sirve para mostrar las publicaciones y los servicios solicitados que tiene un usuario
export default function MisPublicaciones({tipoPublicacion}) {
  const classes = Estilos();
  const { state } = useContext(ObtenerEstadoAplicacion);
  const [tituloPagina, setTituloPagina] = useState("");
  const [cargando, setcargando] = useState(false)
  const [solicitudes, setsolicitudes] = useState([])
  const [resenas_servicio, setresenas_servicio] = useState(null)

  useEffect(()=>{
    setcargando(true)
    //Dependiendo de si se quiere crear una publicación o solicitar un servicio, se muestra la pantalla correspodiente
    if(tipoPublicacion){
      setTituloPagina("Mis publicaciones");
    }else{
      setTituloPagina("Mis servicios solicitados");
    }
    if(state.jwt!==""){
      setresenas_servicio(null)
      buscarSolicitudes()
    }
  },[state.jwt, tipoPublicacion])

  //Función que trae todas las publicaciones o solicitudes de servicios que tiene un usuario, dependiendo desde dónde se acceda
  function buscarSolicitudes(){
    axios.get(state.servidor+"/api/solicitud?Usuario_id="+state.datosSesion.id+"&tipo="+tipoPublicacion)
    .then(response => {
      //Guardamos las solicitudes en un arreglo
      setsolicitudes(response.data)
      setcargando(false)
    })
    .catch(error => {
      console.log("Un error ha ocurrido al cargar las solicitudes.")
      console.log(error.response)
    })
    //Si se están listando publicaciones, entonces traemos también las reseñas
    if(tipoPublicacion){
      axios.get(state.servidor+"/api/resenas?proveedor="+state.datosSesion.id)
      .then(response => {
        let servicios_resena = {}
        //Seteamos únicamente las reseñas que correspondan a cada publicación
        response.data.map((resena=>{
          resena.servicios.map(serv_=>{
            if(!servicios_resena.hasOwnProperty(serv_.nombre)){
              servicios_resena[serv_.nombre] = {resenas:[]}
              servicios_resena[serv_.nombre].resenas.push(resena)
            }else{
              servicios_resena[serv_.nombre].resenas.push(resena)
            }
          })
        }))
        setresenas_servicio(servicios_resena)
      })
      .catch(error => {
        console.log("Un error ha ocurrido al buscar los servicios.")
        console.log(error.response)
      })
    }
  }

  return (
    <div className={classes.fondo} style={{margin:"auto"}}>
      <Container> 
          <Paper elevation={3} style={{maxWidth:950, padding: 15}} className="Fondo">
              <Typography variant="h5" component="h2" align="center">{tituloPagina}</Typography>
              <br/>
              {
                //Cuando cargando es true (seteado al momento de empezar a realizar la búsqueda de las publicaciones), nos muestra el componente de carga,
                //y desaparece cuando cambia a false (seteado al finalizar la búsqueda de los datos)
                cargando && <Cargando/>
              }
              {
                !cargando && solicitudes.length===0 && (<Alerta variant="outlined" severity="info">
                  No tienes {tipoPublicacion?"publicaciones ":"solicitudes "}de servicios
                </Alerta>)
              }
              {
                solicitudes.map((solicitud, i)=>(
                  <FilaPublicacion resenas={resenas_servicio===null?null:resenas_servicio[solicitud.Servicio_id.nombre]} buscarSolicitudes={buscarSolicitudes} key={i} datos={solicitud} tipoPublicacion={tipoPublicacion} contactar={true}/>
                ))
              }
          </Paper>
      </Container>
    </div> 
  )
}
