import React,{useState, useEffect, useContext} from 'react';
import axios from 'axios'
import {useParams, useHistory} from 'react-router-dom'
//Material-UI
import {Typography, TextField, FormControl, Button, Paper, Grid, Select, MenuItem, InputLabel} from '@material-ui/core';
import Cargando from '@material-ui/core/LinearProgress';

import AlertaMensaje from '../AlertaMensaje.js';
import SubirImagenes from '../SubirImagen.js';
import Estilos from '../Estilos.js';
import { ObtenerEstadoAplicacion } from '../../Estados/AplicacionEstado'

//Componente utilizado para crear o modificar publicaciones o solicitudes de servicios
export default function CrearPublicacion({tipoPublicacion, modificar}) {
    const classes = Estilos();
    const { state } = useContext(ObtenerEstadoAplicacion);
    let { id } = useParams();
    let history = useHistory();
    const [precioPresupuesto, setPrecioPresupuesto] = useState("");
    const [titulo, setTitulo] = useState("");
    const [categorias, setcategorias] = useState([]);
    const [servicios, setservicios] = useState([]);
    const [cargando, setcargando] = useState(false);
    const [imagenes, setimagenes] = useState([]);
    const [abrir, setabrir] = useState(false);
    const [mensaje, setmensaje] = useState("");

    const [imagenesSubidas, setimagenesSubidas] = useState([]);
    const [imagenesBorradas, setimagenesBorradas] = useState([]);

    //Datos de la pagina
    const [datosPagina, setdatosPagina] = useState({
        titulo:"",
        precio_estimado: "",
        Categoria_id: {nombre: ""},
        Servicio_id: {nombre:""},
        descripcion:"",
        imagenes:[],
        pausado: false,
        bloqueado: false
    });

    useEffect(()=>{
        //Dependiendo de si se quiere crear una publicación o solicitar un servicio, se muestra la pantalla correspodiente
        if(tipoPublicacion){
            setTitulo(modificar?"Modificar publicación":"Crear publicación");
            setPrecioPresupuesto("Precio estimado");
        }else{
            setTitulo(modificar?"Modificar solicitud de servicio":"Solicitar servicio");
            setPrecioPresupuesto("Presupuesto");
        }
        if (state.jwt!=="" || state.publico===true){
            setcargando(true)
            //Traemos las categorías que tiene el sistema
            axios.get(state.servidor+"/api/categorias")
            .then(response => {
                setcategorias(response.data)
                setcargando(false)
            })
            .catch(error => {
                console.log("Un error ha ocurrido al cargar las categorías.")
                console.log(error.response)
            })
        }
    },[state.jwt, state.publico, tipoPublicacion, modificar])

    useEffect(()=>{
        //Si se quiere modificar una publicación...
        if(modificar && categorias.length!==0){
            setcargando(true)
            //Traemos la publicación que se quiere modificar
            axios.get(state.servidor+"/api/solicitud/"+id)
            .then(response => {    
                //Solamente se permite modificar si se es el dueño de la publicación         
                if (state.datosSesion.id===response.data.Usuario_id.id){
                    //Seteamos los datos de la publicación
                    response.data["imagenes"] = response.data.imagenes.map((imagen)=>(imagen.id))
                    setdatosPagina(response.data)
                    //Si es una publicación, entonces también seteamos los servicios
                    if (tipoPublicacion)
                        categorias.map(cat =>{
                            if(cat.id===response.data.Servicio_id.categoria){
                                setservicios(cat.servicios)
                            }
                        })
                }else{
                    history.push(state.ruta+"/")
                }
                setcargando(false)
            })
            .catch(error => {
                console.log("Un error ha ocurrido al cargar la solicitud.")
                console.log(error.response)
            })
        }
    },[categorias])
    
    //Funcion para captar los cambios en los inputs 
    function modificarInput(e){
        setdatosPagina({
            ...datosPagina,
            [e.target.name]: e.target.value
        })
    }
    
    const funcionSetImagen = (file, cantidad, tipo, subidas) =>{
        setimagenesSubidas(subidas)
        //Si es 0, entonces se agrega la imagen a su respectiva variable, si es 1 entonces se desea eliminar
        if(tipo===0){
            setimagenes([...imagenes, file])
        }else{
            setimagenesBorradas(img => [...imagenesBorradas, file])
            let aux = imagenes.filter(f => f !== file)
            setimagenes(aux)
        }
        setimagenesSubidas(subidas)
    }

    //Se ejecuta al presionar el botón de guardar
    const guardarDatos = (e) => {
        e.preventDefault()
        setcargando(true)
        const formData = new FormData()

        let archivosNuevos = []
        
        //archivosNuevos es el arreglo que contiene los archivos que han sido agregados y no los que ya han sido subidos al servidor
        imagenes.map((imagen) => {
            let iguales = imagenesSubidas.some(img => img === imagen)
            if(!iguales){
                archivosNuevos.push(imagen)
            }
        })

        //archivosBorrados es el arreglo que contiene los archivos que han sido subidos al servidor pero que han sido eliminados en el frontend
        let archivosBorrados = []
        imagenesBorradas.map((imagen) => {
            let iguales = imagenesSubidas.some(img => img === imagen)

            if(iguales){
                archivosBorrados.push(imagen)
            }
        })
        
        //Si existen elementos dentro del arreglo imagenesBorradas, significa que se quieren borrar imágenes de la publicación
        for(let indx = 0; indx < imagenesBorradas.length; indx++){
            let id = Number(imagenesBorradas[indx].name)
            
            let auth = 'Bearer '+state.jwt;
            axios.delete(state.servidor+"/upload/files/"+id,
            {
                headers: {
                'Authorization': auth
            },})
            .then(response => {         
            }).catch(error => {
                console.log("Error al borrar las imagenes")
                console.log(error.response)
            })
        }

        //Se cargan en el fromData las nuevas imágenes cargadas a la publicación, si es que las hay, y los datos modificados
        for(let i = 0; i<archivosNuevos.length; i++){
            formData.append('files.imagenes', archivosNuevos[i])
        }
        formData.append('data', JSON.stringify({
            titulo: datosPagina.titulo,
            precio_estimado: datosPagina.precio_estimado===""?0:datosPagina.precio_estimado,
            descripcion: datosPagina.descripcion,
            Categoria_id: datosPagina.Categoria_id.id,
            Servicio_id: tipoPublicacion?datosPagina.Servicio_id.id:null,
            Usuario_id: state.datosSesion.id,
            pausado: false,
            tipo: tipoPublicacion
        }))

        let auth = 'Bearer '+state.jwt;
        //Si se está creando una publicación, se procede a la creación del la entrada en la tabla correspondiente.
        if (!modificar){
            axios.post(
                state.servidor+"/api/solicitud",
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': auth
                    },
            })
            .then(response => {
                let estaServicio = state.datosSesion.servicios.some(servicio=>(servicio.id===datosPagina.Servicio_id.id))
                //Procedemos a asociar el nuevo servicio (si es que es nuevo) al arreglo de servicios del proveedor
                if (tipoPublicacion && !estaServicio){
                    let servicios_id = state.datosSesion.servicios.map(servicio_=>(servicio_.id))
                    servicios_id.push(datosPagina.Servicio_id.id)
                    axios.put(
                        state.servidor+"/users/"+state.datosSesion.id,{
                            servicios: servicios_id
                        },
                        {headers: {'Authorization': auth},
                    })
                    .then(response => {
                        setcargando(false)
                    })
                    .catch(error => {
                        console.log(error.response)
                        console.log("Ha ocurrido un error al guardar los datos")
                        setcargando(false)
                    })
                }
                setcargando(false)
                setmensaje("¡Publicación creada!")
                setabrir(true)
                setTimeout(() => {  history.push(state.ruta+"/"); }, 3000);
            })
            .catch(error => {
                console.log("Error, no se ha podido crear la solicitud.", error.response)
            })
        //Si se desea modificar una publicación, se envía la petición con los nuevos datos
        }else{
            axios.put(
                state.servidor+"/api/solicitud/"+id,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': auth
                },
            })
            .then(response => {
                //Si la publicación estaba bloqueada por un administrador, entonces se ejecuta el método
                if (response.data.bloqueado)
                    modificarBloqueadoReporte()
                setcargando(false)
                setmensaje("¡Publicación modificada!")
                setabrir(true)
                setTimeout(() => {  history.push(state.ruta+"/"); }, 3000);

            })
            .catch(error => {
                console.log("Error, no se ha podido modificar la solicitud.", error.response)
            })
        }
    }

    //Función utilizada para modificar el reporte asociado al bloqueo, de tal manera de que vuelva a aparecer en la lista de reportes a moderar
    function modificarBloqueadoReporte(){
        let auth = 'Bearer '+state.jwt;
        //Traemos el reporte asociado a la publicación
        axios.get(
            state.servidor+"/api/reportes?Solicitud_id="+datosPagina.id,
            {
                headers: {
                    'Authorization': auth
            },
        })
        .then(response => {
            let reportes_ = response.data.filter((reporte)=>reporte.estado === 1)
            //Modificamos el reporte y le asignamos el esto "en espera"
            reportes_.map(report => {
                axios.put(
                    state.servidor+"/api/reportes/"+report.id,{
                        estado: -1
                    },{
                        headers: {
                            'Authorization': auth
                    },
                })
                .then(response => {               
                })
                .catch(error => {
                    console.log("Error: ", error.response)
                })
            })
        })
        .catch(error => {
            console.log("Error: ", error.response)
        })
    }

    //Al seleccionar una categoría, se procede a cargarlo en el campo correspondiente y setear los servicios que se deben mostrar
    function seleccionarCategoria(e){
        let categoriaSeleccionada = categorias.filter((cat) => cat.nombre === e.target.value)
        setservicios(categoriaSeleccionada[0].servicios)
        setdatosPagina({
            ...datosPagina,
            Categoria_id: categoriaSeleccionada[0],
            Servicio_id: {nombre:""}
        })
    }

    //Seteamos el servicio seleccionado
    function seleccionarServicio(e){
        let servicioSeleccionado
        categorias.map((cat) =>{
            if(cat.nombre===datosPagina.Categoria_id.nombre){
                servicioSeleccionado = cat.servicios.filter((serv) => serv.nombre === e.target.value)
            }
        })
        setdatosPagina({
            ...datosPagina,
            Servicio_id: servicioSeleccionado[0]   
        })
    }

    //Si se presiona en cancelar, se vuelve al inicio
    function cancelar(){
        history.push(state.ruta+"/")    
    }

    return ( 
    <div className={classes.fondo}>
        <Paper elevation={3} style={{padding: "10px"}} className="Fondo">
            <form onSubmit={guardarDatos}>
                <FormControl className={classes.padding2} color="primary" fullWidth>
                    <Grid className={classes.pantallaMedia} container direction="row" justify="center" alignItems="center" spacing={1}>
                        <Grid item xs={12}>
                            <Typography variant="h5" component="h1" align="center">
                                {titulo}
                            </Typography>
                        </Grid>
                        
                        <Grid item sm={8} xs={12}>
                            <TextField
                            onChange={modificarInput}
                            value={datosPagina.titulo}
                            name="titulo"
                            className={classes.inputAncho}
                            id="filled-basic"
                            label="Título de la publicación"
                            variant="filled"
                            maxLength={50}
                            required/>
                        </Grid>

                        <Grid item sm={4} xs={12}>
                            <TextField
                            onChange={modificarInput}
                            value={datosPagina.precio_estimado}
                            name="precio_estimado"
                            type="number"
                            className={classes.inputAncho}
                            id="formatted-numberformat-input"
                            label={precioPresupuesto}
                            variant="filled"/>
                        </Grid>

                        <Grid item sm={6} xs={12}>
                            <FormControl className={classes.inputAncho}>
                                <InputLabel id="Categoria_id" variant="filled">Categoría</InputLabel>
                                <Select
                                    value={datosPagina.Categoria_id.nombre}
                                    name="Categoria_id"
                                    onChange={seleccionarCategoria}
                                    id="Categoria_id"
                                    labelId="Categoria_id"
                                    variant="filled"
                                    label="Categoría"
                                    required>
                                    {
                                        categorias.map((categoria, i)=>(
                                            <MenuItem key={i} value={categoria.nombre}>{categoria.nombre}</MenuItem>
                                        ))
                                    }
                                </Select>
                            </FormControl>
                        </Grid>
                        
                        {
                            tipoPublicacion &&
                            (<Grid item sm={6} xs={12}>
                                <FormControl className={classes.inputAncho}>
                                    <InputLabel id="Servicio_id" variant="filled">Servicio</InputLabel>
                                    <Select 
                                        value={datosPagina.Servicio_id.nombre}
                                        name="Servicio_id"
                                        id="Servicio_id"
                                        labelId="Servicio_id"
                                        onChange={seleccionarServicio} 
                                        label="Servicio"
                                        variant="filled"
                                        required>
                                        {
                                            servicios.map((servicio, i)=>(
                                                <MenuItem key={i} value={servicio.nombre}>{servicio.nombre}</MenuItem>
                                            ))
                                        }   
                                    </Select>
                                </FormControl>
                            </Grid>)
                        }

                        <Grid item xs={12}>
                            <TextField
                            onChange={modificarInput}
                            value={datosPagina.descripcion}
                            name="descripcion"
                            className={classes.inputAncho}
                            id="filled-basic"
                            label="Descripción"
                            maxLength={400}
                            multiline
                            variant="filled"/>
                        </Grid>

                        <Grid item xs={12} className={classes.inputAncho}>
                            <SubirImagenes cantidad={10} funcionSetImagen={funcionSetImagen} setcargando={setcargando} ids={datosPagina.imagenes}/>
                        </Grid>
                        
                        <Grid item xs={12} className={classes.inputAncho}>
                            {cargando && <Cargando/>}
                        </Grid>

                        <Grid item xs={6} align="center">
                            <Button className={classes.botones} disabled={cargando} type="submit" size="large" variant="contained" color="primary">Guardar</Button>
                        </Grid>
                        <Grid item xs={6} align="center">
                            <Button className={classes.botones} onClick={cancelar} size="large" variant="contained" color="secondary">Cancelar</Button>
                        </Grid>
                        <AlertaMensaje mensaje={mensaje} abrir={abrir} setabrir={setabrir}/>
                    </Grid>
                </FormControl>
            </form>
        </Paper>
    </div>
  );
}