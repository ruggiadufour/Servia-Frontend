import React,{useState, useContext, useEffect} from 'react';
import {useHistory } from 'react-router-dom'
import axios from 'axios';
//Material-UI
import {Hidden, Typography, TextField, FormControl, Button, Paper, Grid, Checkbox, FormControlLabel} from '@material-ui/core/';
import BarraDeCarga from '@material-ui/core/LinearProgress'
//Componentes
import SubirImagenes from '../SubirImagen.js';
import Estilos from '../Estilos.js';
import SeleccionarServicio from '../SeleccionarServicio.js';
import AlertaMensaje from '../AlertaMensaje.js';
import { ObtenerEstadoAplicacion } from '../../Estados/AplicacionEstado'

//Componente utilizado para modificar el perfil de proveedor
export default function ModificarPerfilProveedor() {
    //Variables de la página
    const classes = Estilos();
    let history = useHistory();
    const { state, dispatch } = useContext(ObtenerEstadoAplicacion);
    const [cargando, setcargando] = useState(false)
    const [controlGuardar, setcontrolGuardar] = useState(false)
    const [categorias, setcategorias] = useState([])
    const [serviciosSeleccionados, setserviciosSeleccionados] = useState([])
    const [mensaje, setmensaje] = useState(false)
    const [abrir, setabrir] = useState(false)
    const [imagenes, setimagenes] = useState([])
    const [imagenesBorradas, setimagenesBorradas] = useState([]);
    const [imagenesSubidas, setimagenesSubidas] = useState([]);
    const [datos, setdatos] = useState({
        descripcion: "",
        estado: false,
        mostrar_telefono: false,
        pasarImagenes: [] 
    });

    const funcionSetImagen = (file, cantidad, tipo, subidas) =>{
        setimagenesSubidas(subidas)
        //Si es 0, entonces se agrega la imagen a su respectiva variable, si es 1 entonces se desea eliminar
        if(tipo===0){
            setimagenes([...imagenes, file])
        }else{
            setimagenesBorradas(img => [...imagenesBorradas, file])
            let aux = imagenes.filter(f => f.file !== file)
            setimagenes(aux)
        }
    }
    //Se ejecuta para traer los datos que el usuario ya tiene, si es que los tiene
    useEffect(()=>{
        if(state.jwt!=="" || state.publico===true){
            //Asignamos el estado a las variables de los componentes
            let pasar = state.datosSesion.imagenes_proveedor.map((item)=>(item.id))
            setdatos({
                descripcion: state.datosSesion.descripcion,
                estado: state.datosSesion.estado,
                mostrar_telefono: state.datosSesion.mostrar_telefono,
                pasarImagenes: pasar
            })

            //Buscamos las categorias para cargarlas en los checkboxes
            axios.get(
                state.servidor+"/api/categorias"
            )
            .then(response => {
                response.data.map((item)=>{
                    item["seleccionado"] = false

                    item.servicios.map((itemserv) =>{
                        itemserv["seleccionado"] = false
                    })

                    if(state.datosSesion.servicios.length!==0){
                        response.data.map((categoria) =>{
                            categoria.servicios.map((servicio) =>{

                                state.datosSesion.servicios.map((servicioSesion)=>{
                                    if(servicioSesion.categoria === categoria.id){
                                        categoria.seleccionado = true
                                    }

                                    if(servicioSesion.id===servicio.id){
                                        servicio.seleccionado = true
                                    }
                                })

                            })
                        })
                    }                
                })
                setcategorias(response.data)
            })
            .catch(error => {
                console.log("Un error ha ocurrido al cargar las categorías.")
                console.log(error.response)
            }) 
        }
    },[state.jwt, state.publico])

    //Función que registra los cambios en los checkboxes
    const cambiarCheckbox = (e) =>{  
        if(!controlGuardar)
            setcontrolGuardar(true)
        
        let valor = e.target.checked;
        let campo = e.target.name;
        setdatos({
            ...datos,
            [campo]: valor
        })
    }

    //Ejecutado al guardar los datos
    const guardarDatos = () => {
        let aux = [];
        categorias.map((categoria)=>{
            if(categoria.seleccionado){
                categoria.servicios.map((servicio)=>{
                    if(servicio.seleccionado){
                        aux.push(servicio.id)
                        if(!controlGuardar){
                            setcontrolGuardar(true)
                        }
                    }
                })
            }
        })
        if(aux.length!==0){
            setmensaje(false)
        }else{
            setmensaje(true)
        }
        setserviciosSeleccionados(aux)
    }
    
    function subirImagenes(_id_){
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
        
        //Subiendo las imagenes seleccionadas
        const formData = new FormData()
        
        //Se cargan en el fromData las nuevas imágenes cargadas a la publicación, si es que las hay, y los datos modificados
        for(let i = 0; i<archivosNuevos.length; i++){
            formData.append('files', archivosNuevos[i])
        }
        
        if(archivosNuevos.length!==0){
            formData.append('ref', 'user')
            formData.append('refId', _id_)
            formData.append('field', 'imagenes_proveedor')
            formData.append('source', 'users-permissions')

            let auth = 'Bearer '+state.jwt;

            axios.post(
                state.servidor+"/upload",
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': auth
                    },
                })
            .then(response => {
                let usr = state.datosSesion
                usr.imagenes_proveedor = response.data

                dispatch({type:"setDatos", value: usr})
                dispatch({type:"setJwt", value: state.jwt})

                localStorage.setItem('datosLocal', JSON.stringify({
                    jwt: state.jwt,
                    datosSesion: usr
                }));
            })
            .catch(error => {
                console.log("Error al cargar las imágenes.")
                console.log("Error: ", error.response)
            })
        }
    }

    //Se ejecuta al enviar los datos y tener algún servicio seleccionado
    useEffect(()=>{
        if(serviciosSeleccionados.length!==0){
            let auth = 'Bearer '+state.jwt;

            setcargando(true)
            subirImagenes(state.datosSesion.id)

            //Se modifican los datos del proveedor con los nuevos datos
            axios.put(
                state.servidor+"/users/"+state.datosSesion.id
                ,{
                    descripcion: datos.descripcion,
                    estado: datos.estado,
                    mostrar_telefono: datos.mostrar_telefono,
                    servicios : serviciosSeleccionados
                },
                {
                    headers: {
                        'Authorization': auth
                    },
                }
            )
            .then(response => {
                let datos_ayuda = response.data

                dispatch({type:"setDatos", value: response.data})
                localStorage.setItem('datosLocal', JSON.stringify({
                    jwt: state.jwt,
                    datosSesion: datos_ayuda
                }));
                setabrir(true)
                setcargando(false)
                setTimeout(() => {  history.push(state.ruta+"/"); }, 3000);
            })
            .catch(error => {
                console.log("Ha ocurrido un error al guardar los datos")
                console.log(error.response)
                setcargando(false)
            })
        }
    },[serviciosSeleccionados])
    //-----------------------------------------------------------------------------------------------------------------------------------------------------
    
    return (
        <div className= {classes.fondo}>
            <Paper elevation={3} className= {classes.pantallaMedia}>
                <FormControl color="primary" fullWidth>
                    <Grid className={classes.filaPublicacion} container direction="row" justify="space-around" alignItems="center" spacing={1}>
                        <Grid item xs={12}>
                            <Typography variant="h5" component="h1" align="center">
                                Modificar mis datos de proveedor
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>    
                            <FormControlLabel
                                className={classes.inputAncho}
                                control={<Checkbox checked={datos.estado} name="estado" onChange={cambiarCheckbox}/>}
                                label="Pausar mis servicios"
                            />
                        </Grid>

                        <Grid item xs={12}>    
                            <FormControlLabel
                                className={classes.inputAncho}
                                control={<Checkbox name="mostrar_telefono" checked={datos.mostrar_telefono} onChange={cambiarCheckbox}/>}
                                label="Mostrar mi número de teléfono"
                            />
                        </Grid>
                        
                        <Grid item xs={12}>
                            <TextField
                            className={classes.inputAncho}
                            onChange={(e)=>{
                                setdatos({
                                ...datos,
                                descripcion: e.target.value
                                })
                                if(!controlGuardar)
                                    setcontrolGuardar(true)
                            }}
                            name="descripcion"
                            value={datos.descripcion}
                            id="filled-basic"
                            label="Descripción"
                            multiline
                            variant="filled"/>
                        </Grid>

                        <Grid item xs={12} className={classes.inputAncho}>
                            <SubirImagenes setcargando={setcargando} cantidad={10} funcionSetImagen={funcionSetImagen} ids={datos.pasarImagenes}/>
                        </Grid>
                        
                        <AlertaMensaje mensaje="¡Tus datos se han guardado correctamente!" abrir={abrir} setabrir={setabrir}/>

                        <Grid item xs={12} >
                            <Typography variant="h6" component="h3" align="left" className={classes.alinearInputs}>
                                Selecciona los servicios que ofreces
                            </Typography>
                        </Grid>
                        
                        
                        {
                            categorias.map((categoria, i)=>(
                                <Grid key={i} item xs={12}>
                                    <Grid container justify="flex-start">
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={categoria.seleccionado}
                                                    onChange={(e)=>{setcategorias(categorias.map((cat, j)=>{
                                                        if(i===j){
                                                            cat.seleccionado = e.target.checked
                                                        }
                                                        return cat
                                                    }))}}
                                                />}
                                            label={categoria.nombre}
                                        />
                                    </Grid>
                                    <Hidden xlDown={!categoria.seleccionado}>
                                        <Grid container spacing={2} justify="space-around">    
                                            {
                                                categoria.servicios.map((servicio,k) => (
                                                <Grid item xs={6} sm={4} md={3} lg={2} key={k}>
                                                    <SeleccionarServicio
                                                    servicio={servicio} 
                                                    agregarSeleccionado={(valor)=>{
                                                        servicio.seleccionado = valor
                                                        //Asignamos los valores "true" a aquellos servicios que son seleccionados
                                                        setcategorias(categorias.map((cat, j)=>{
                                                            if(i===j){
                                                                cat.servicios[k] = servicio
                                                            }
                                                            return cat
                                                        }))
                                                    }}/>
                                                </Grid>
                                                ))
                                            }
                                        </Grid>
                                    </Hidden>
                                </Grid>
                            ))
                        }
                        
                        <Hidden xlDown={!mensaje || cargando}>
                            <Grid item xs={12} align="center">
                                <Typography color="error">
                                    Debe seleccionar al menos un servicio.
                                </Typography>
                            </Grid>
                        </Hidden>

                        <div className={classes.inputAncho} hidden={!cargando}>
                            <BarraDeCarga/>
                        </div>

                        <Grid item xs={6} align="center">
                            <Button onClick={guardarDatos} disabled={cargando} size="large" variant="contained" color="primary">Guardar</Button>
                        </Grid>
                        <Grid item xs={6} align="center">
                            <Button onClick={()=>{history.push(state.ruta+"/")}} size="large" variant="contained" color="secondary">Cancelar</Button>
                        </Grid>
                    </Grid>
                </FormControl>
            </Paper>
        </div>
    );
}


