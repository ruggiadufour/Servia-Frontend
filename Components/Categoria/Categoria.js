import React, {useState, useEffect, useContext} from 'react';
import {useParams} from 'react-router-dom'
import axios from 'axios'

//Componentes
import Filtro from './Filtro.js';
import FilaPublicacion from './FilaPublicacion.js';
import Estilos from '../Estilos.js';
//Material UI
import {Typography, Paper} from '@material-ui/core/'
import Cargando from '@material-ui/core/LinearProgress';
import Alerta from '@material-ui/lab/Alert';

import { ObtenerEstadoAplicacion } from '../../Estados/AplicacionEstado'

//Este componente sirve para poder ver publicaciones (mostradas en filas resumidas) de una determinada categoría, 
//nos permite filtrar las publicaciones segun tipo de servicio, tipo de publicacion o solicitud y según el nombre de la publicación
export default function Categoria() {
    const classes = Estilos();
    let { id } = useParams()
    const { state, dispatch } = useContext(ObtenerEstadoAplicacion);
    //Variables de la página 
    const [serviciosSeleccionados, setServiciosSeleccionados] = useState([])
    const [categoria, setcategoria] = useState({nombre:""})
    const [servicios, setservicios] = useState([])
    const [solicitudes, setsolicitudes] = useState([])
    const [cargando, setcargando] = useState(false)
    const [resenas_servicio, setresenas_servicio] = useState(null)
    const [tipoPublicacion, settipoPublicacion] = useState(true)
    const [inputBusqueda, setinputBusqueda] = useState("")

    //Metodo que se ejecuta cuando se carga el componente (la pagina de categoría)
    useEffect(()=>{
        setcargando(true)
        if(state.jwt!=="" || state.publico===true){
            //Se busca la información de la categoría seleccionada
            axios.get(state.servidor+"/api/categorias/"+id)
            .then(response => {
                //Se actualizan los datos de las variables
                setcategoria(response.data)
                setservicios(response.data.servicios)
            })
            .catch(error => {
                console.log("Un error ha ocurrido al cargar las categorías.")
                console.log(error.response)
            }) 
        }
        buscarSolicitudes()
    },[state.jwt, state.publico])

    //Funcion que permite buscar publicaciones conforme al tipo de publicación (este metodo se ejecuta al inicio del renderizado)
    function buscarSolicitudes(){
        axios.get(state.servidor+"/api/solicitud?Categoria_id="+id+"&pausado=false&bloqueado=false&tipo="+tipoPublicacion)
        .then(response => {
            let hoy = Date.now()
            let filtro = []
            response.data.map((solicitud)=>{
                let modificado = new Date(solicitud.updated_at)
                let dias = parseInt((hoy-modificado)/1000/60/60/24)
               
                let diasTipo = tipoPublicacion?30:15
                if(dias <= diasTipo){
                    filtro.push(solicitud)
                }
            })
            
            //Filtramos las publicaciones donde sus proveedores no estén pausados
            setcargando(false)
            if (tipoPublicacion){
                filtro = filtro.filter((solicitud)=>(solicitud.Usuario_id.estado === false && solicitud.Usuario_id.bloqueado===false))
                setsolicitudes(filtro)
            }else{
                setsolicitudes(filtro)
            }
        })
        .catch(error => {
            console.log("Un error ha ocurrido al cargar las categorías.")
            console.log(error.response)
        })
    }

    //Se agregan en un arreglo los servicios seleccionados para la búsqueda de éstos
    const agregarSeleccionado = (servicio) => {
        let encontrado = serviciosSeleccionados.some((elemento) => elemento===servicio);
        
        if(!encontrado){
            setServiciosSeleccionados((arreglo)=>[...arreglo, servicio]);
        }else{
            setServiciosSeleccionados(serviciosSeleccionados.filter((elemento)=>servicio!==elemento));
        }
    }

    //Esta función permite buscar las publicaciones según los filtros seleccionados (servicios, tipo de publicacion y nombre de publicación)
    function buscarServicios(){
        let IDS = "&"
        setcargando(true)

        serviciosSeleccionados.map((id)=>{
            if(id!==null){
                IDS+="Servicio_id="+id+"&"
            }
        })

        if(IDS.length===1){
            if (tipoPublicacion){
                servicios.map((servicio)=>{
                    if(servicio!==null){
                        IDS+="Servicio_id="+servicio.id+"&"
                    }
                })
            }else{
                IDS+="Categoria_id="+id+"&"
            }
        }

        //Buscamos las solicitudes según los parametros que seleccionamos
        axios.get(state.servidor+"/api/solicitud?"+IDS+"pausado=false&bloqueado=false&tipo="+tipoPublicacion+"&titulo_contains="+inputBusqueda)
        .then(response => {
            let hoy = Date.now()
            let filtro = []
            response.data.map((solicitud)=>{
                let modificado = new Date(solicitud.updated_at)
                let dias = parseInt((hoy-modificado)/1000/60/60/24)
               
                let diasTipo = tipoPublicacion?30:15
                if(dias <= diasTipo){
                    filtro.push(solicitud)
                }
            })
            
            if (tipoPublicacion){
                //Descartamos las solicitudes que tienen usuarios pausados y bloqueados
                filtro = filtro.filter((solicitud)=>(solicitud.Usuario_id.estado === false && solicitud.Usuario_id.bloqueado===false))
                setsolicitudes(filtro)
            }else{
                setsolicitudes(filtro)
            }
          setcargando(false)
        })
        .catch(error => {
            console.log("Un error ha ocurrido al cargar las categorías.")
            console.log(error.response)
        })
    }

    //Función que utilizamos para poder pasarle a filaPublicación las reseñas, de modo que se pueda calcular el promedio de la publicación
    useEffect(()=>{
        if(servicios.length!==0){
            let ids_ = ""
            servicios.map((servicio_)=>{
                ids_+="servicios="+servicio_.id+"&"
            })

            //Buscamos todas las reseñas que sean de los servicios de la categoría
            axios.get(state.servidor+"/api/resenas?"+ids_)
            .then(response => {
                //Generamos un diccionario que posee las reseñas agrupadas segun el servicio al que pertenecen
                let servicios_resena = {}
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
                console.log("Un error ha ocurrido al buscar las reseñas.")
                console.log(error.response)
            })
        }
    },[servicios])

    
    return (
        <div className={classes.fondo}>
            <Paper elevation={3} style={{width:950, padding: 15}} className="Fondo">
                <Typography variant="h5" component="h2" align="center">{categoria.nombre}</Typography>
                <Filtro
                    tipoPublicacion={tipoPublicacion}
                    settipoPublicacion={settipoPublicacion}
                    inputBusqueda={inputBusqueda}
                    setinputBusqueda={setinputBusqueda}
                    servicios={servicios}
                    agregarSeleccionado={agregarSeleccionado}
                    buscarServicios={buscarServicios}
                />
                <br/>
                {cargando && <Cargando/>}
                {
                    !cargando && solicitudes.length===0 && (<Alerta variant="outlined" severity="info">
                    Lo sentimos, por el momento no hay {tipoPublicacion?"publicaciones ":"solicitudes "} de servicios que coincidan con los filtros de búsqueda.
                    </Alerta>)
                }
                { 
                    solicitudes.map((solicitud, i)=>{            
                        return (<FilaPublicacion
                            key={i}
                            resenas={solicitud.tipo?(resenas_servicio===null?null:resenas_servicio[solicitud.Servicio_id.nombre]):null}
                            buscarSolicitudes={buscarSolicitudes}
                            datos={solicitud}
                            tipoPublicacion={tipoPublicacion}
                            contactar={true}/>
                        )
                    })
                }
            </Paper>
        </div>
    )
}