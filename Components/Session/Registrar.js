import React,{useState, useEffect, useContext} from 'react';
import {useHistory } from 'react-router-dom'

//Material UI
import {LinearProgress, Typography, TextField, Button, Divider, Paper, Grid, Checkbox, FormControlLabel, Hidden} from '@material-ui/core/';

//Libreria para consultar la API del servidor
import axios from 'axios';

//Componentes creados
import Estilos from '../Estilos.js';
import SubirImagen from '../SubirImagen.js';
import InicioSesion from "./InicioSesion.js";
import AlertaMensaje from '../AlertaMensaje.js';

import { ObtenerEstadoAplicacion } from '../../Estados/AplicacionEstado'

//Componente utilizado para registrar un nuevo usuario o para modificar los datos de un usuario
export default function Registrar({registrar}){
    const classes = Estilos()
    //Variables de la página
    const [mensaje, setmensaje] = useState("");
    const [mensajeAlerta, setmensajeAlerta] = useState("");
    let history = useHistory();
    const [tituloPagina, settituloPagina] = useState("")
    const [cargando, setcargando] = useState(false)
    const { state, dispatch } = useContext(ObtenerEstadoAplicacion);
 
    //Variables de los campos   
    const [imagenes, setimagenes] = useState([])
    const [ImagenPerfil, setImagenPerfil] = useState([])
    const [imagenesBorradas, setimagenesBorradas] = useState([]);
    const [imagenesSubidas, setimagenesSubidas] = useState([]);
    const [abrir, setabrir] = useState(false);
    const [datos, setdatos] = useState({
        nombre:"",
        apellido:"",
        email:"",
        usuario:"",
        telefono:"",
        contrasena:"",
        contrasena_rep:"",
        dni:"",
        descripcion:"",
        imagen_perfil: null
    });
    //Proveedor
    const [soyProveedor, setSoyProveedor] = useState(false);

    //Si se quiere modificar los datos, entonces seteamos los datos del usuario en los campos
    useEffect(()=>{
        if(state.jwt!=="" || state.publico===true){
            if(!registrar){            
                setdatos({
                    nombre: state.datosSesion.nombre,
                    apellido: state.datosSesion.apellido,
                    email: state.datosSesion.email,
                    usuario: state.datosSesion.username,
                    telefono: state.datosSesion.telefono,
                    contrasena: "",
                    contrasena_rep: "",
                    dni: state.datosSesion.dni,
                    descripcion: state.datosSesion.descripcion,
                    tipo: state.datosSesion.tipo,
                    imagen_perfil: state.datosSesion.imagen_perfil
                })
                
                if(state.datosSesion.imagen_perfil!==null)
                    setimagenes([state.datosSesion.imagen_perfil.id])
            }
        }
    },[state.jwt, state.publico])

    //Cada vez que se escribe algo en un campo, lo capturamos y lo seteamos en los datos
    const cambiarInput = (e) =>{
        if(mensaje!=="")
            setmensaje("")
        
        let valor = e.target.value;
        let campo = e.target.name;
        setdatos({
            ...datos,
            [campo]: valor
        })
    }

    //Función para setear las imágenes
    const funcionSetImagen = (file, cantidad, tipo, subidas) =>{
        setimagenesSubidas(subidas)
        //Si es 0, entonces se agrega la imagen a su respectiva variable, si es 1 entonces se desea eliminar
        if(tipo===0){
            setImagenPerfil([...ImagenPerfil, file])
        }else{
            setimagenesBorradas(img => [...imagenesBorradas, file])
            let aux = ImagenPerfil.filter(f => f !== file)
            setImagenPerfil(aux)
        }
    }

    //Función para subir las imágenes
    function subirImagen(datos){
        let archivosNuevos = []
        let auth = 'Bearer '+datos.jwt;

        //archivosNuevos es el arreglo que contiene los archivos que han sido agregados y no los que ya han sido subidos al servidor
        ImagenPerfil.map((imagen) => {
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
            formData.append('refId', datos.usuario.id)
            formData.append('field', 'imagen_perfil')
            formData.append('source', 'users-permissions')

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
                let usr = datos.usuario
                usr.imagen_perfil = response.data[0]

                dispatch({type:"setDatos", value: usr})
                dispatch({type:"setJwt", value: datos.jwt})

                localStorage.setItem('datosLocal', JSON.stringify({
                    jwt: datos.jwt,
                    datosSesion: usr
                }));
            })
            .catch(error => {
                console.log("Error: ", error.response)
            })
        }
    }
    
    //Funcion para enviar los datos, ya sea de modificación de perfil como de creación de una cuenta nueva
    const enviarDatos = (e) =>{
        e.preventDefault();        
        if(datos.email.search('[.][a-z][a-z]')=== -1 || datos.email.search('[.].*[0-9].*')!== -1 ){
            setmensaje("El email se encuentra escrito incorrectamente");
        }else{
            if(registrar){
                if(datos.contrasena!==datos.contrasena_rep){
                    setmensaje("Las contraseñas no coinciden")
                }else if(datos.contrasena.length < 8){
                    setmensaje("La contraseña debe tener al menos 8 caracteres");
                }else{
                    //Si se entra a acá, significa que se quiere crear un nuevo usuario
                    enviarPost()
                }
            }else{
                if(datos.email.search('[.][a-z][a-z]')=== -1 || datos.email.search('[.].*[0-9].*')!== -1 ){
                    setmensaje("El email se encuentra escrito incorrectamente");
                }else{
                    //Si se entra a acá, significa que se quiere modificar el usuario                
                    enviarPut()
                }
            }
        }
    }

    //Función que se ejecuta si se quieren modificar datos de usuario
    function enviarPut(){
        let auth = 'Bearer '+state.jwt;
        setcargando(true)
        axios.put(
            state.servidor+"/users/"+state.datosSesion.id
            ,{
                username: datos.usuario,
                email: datos.email,
                nombre: datos.nombre,
                apellido: datos.apellido,
                telefono: datos.telefono,
                dni: datos.dni,
                descripcion: datos.descripcion,
                tipo: datos.tipo===2?2:soyProveedor?2:1
            },
            {
                headers: {
                    'Authorization': auth
                },
            }
        )
        .then(response => {
            //Seteamos los datos de la sesión actual con los nuevos datos
            dispatch({type:"setDatos", value: response.data})
            dispatch({type:"setJwt", value: state.jwt})
            subirImagen({usuario: response.data, jwt: state.jwt})
            localStorage.setItem('datosLocal', JSON.stringify({
                jwt: state.jwt,
                datosSesion: response.data
            }));
            setcargando(false)
            setmensajeAlerta("¡Cambios guardados!")
            setabrir(true)
            setTimeout(() => {  history.push(state.ruta+"/"); }, 3000);
        })
        .catch(error => {
            let err = JSON.parse(error.response.request.response).message[0].messages[0].id;
            console.log("error: ",error.response)
            if(err==="Auth.form.error.email.taken")
                setmensaje('El email ya está en uso.');
            else if(err==="Auth.form.error.username.taken")
                setmensaje('El usuario ya está en uso.');
            else{
                setmensaje(err)
            }
            setcargando(false)
        })
    }

    //Función que se ejecuta si se quiere crear un usuario nuevo
    function enviarPost(){
        setcargando(true)
        axios
        .post(state.servidor+"/auth/local/register", {
            username: datos.usuario,
            email: datos.email,
            password: datos.contrasena,
            nombre: datos.nombre,
            apellido: datos.apellido,
            telefono: datos.telefono,
            dni: datos.dni,
            descripcion: datos.descripcion,
            tipo: soyProveedor?2:1,
            confirmed: false,
            estado: false,
            mostrar_telefono: false,
            identidad_verificada: false,
            espera_verificacion: false,
            bloqueado: false
        })
        .then(response => {
            //Seteamos los datos de la sesión actual con los nuevos datos
            dispatch({type:"setDatos", value: response.data.user})
            dispatch({type:"setJwt", value: response.data.jwt})         
            localStorage.setItem('datosLocal', JSON.stringify({
                jwt: response.data.jwt,
                datosSesion: response.data.user
            }));
            subirImagen({usuario: response.data.user, jwt: response.data.jwt})
            setcargando(false)
            setmensajeAlerta("Usuario creado. ¡Bienvenido a Servia!")
            setabrir(true)
            setTimeout(() => {  history.push(state.ruta+"/"); }, 2000);
        })
        .catch(error => {
            // Ocurrió un error
            let err = JSON.parse(error.response.request.response).message[0].messages[0].id;
            if(err==="Auth.form.error.email.taken")
                setmensaje('El email ya está en uso.');
            else if(err==="Auth.form.error.username.taken")
                setmensaje('El usuario ya está en uso.');
            else
                setmensaje(err)
            setcargando(false)
        });
    }

    /*Cuando se renderiza la pagina debemos saber si ha sido invocada para registrar un usuario o
    para modificar datos  */
    useEffect(()=>{
        if(!registrar){
            settituloPagina("Modificar mi perfil")
        }else{
            settituloPagina("Registrar usuario")
        }
    },[])
    
    return (
        <div className={classes.fondo}>
            <Paper elevation={3} >
                <form onSubmit={enviarDatos}>
                    <Grid className={classes.gridRegistro} spacing={1} container justify="space-between" alignItems="center">
                        <Grid item xs={12}>
                            <Typography variant="h5" component="h1" align="center" className={classes.inputAncho}>
                                {tituloPagina}
                            </Typography>
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                            className={classes.inputAncho}
                            type="text"
                            name="nombre"
                            value={datos.nombre}
                            onChange={cambiarInput}
                            label="Nombre"
                            variant="filled"
                            required/>
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                            className={classes.inputAncho}
                            type="text"
                            name="apellido"
                            value={datos.apellido}
                            onChange={cambiarInput}
                            label="Apellido"
                            variant="filled"
                            required/>
                        </Grid>

                        <Grid item xs={12}>
                            <SubirImagen cantidad={1} setcargando={setcargando} funcionSetImagen={funcionSetImagen} ids={imagenes}/>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                            className={classes.inputAncho}
                            name="email"
                            value={datos.email}
                            onChange={cambiarInput}
                            label="Correo electrónico"
                            variant="filled"
                            type="email"
                            required />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                            className={classes.inputAncho}
                            name="usuario"
                            value={datos.usuario}
                            onChange={cambiarInput}
                            label="Usuario"
                            variant="filled"
                            required />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                            className={classes.inputAncho}
                            type="number"
                            name="telefono"
                            value={datos.telefono}
                            onChange={cambiarInput}
                            label="Telefono"
                            variant="filled"/>
                        </Grid>
                        <Divider/>
                        <Hidden xlDown={!registrar}>
                            <Grid item xs={6}>
                                <TextField
                                    required={registrar}
                                    name="contrasena"
                                    value={datos.contrasena}
                                    onChange={cambiarInput}
                                    type="password"
                                    label="Contraseña"
                                    variant="filled"
                                    className={classes.inputAncho} 
                                />
                            </Grid>

                            <Grid item xs={6}> 
                                <TextField
                                    required={registrar}
                                    name="contrasena_rep"
                                    value={datos.contrasena_rep}
                                    onChange={cambiarInput}
                                    type="password"
                                    label="Repetir contraseña"
                                    variant="filled"
                                    className={classes.inputAncho}
                                />
                            </Grid>
                        </Hidden>
                        
                        <Hidden xlDown={mensaje===""}>
                            <Grid item xs={12}>
                                <Typography color="error">
                                    {mensaje}
                                </Typography>
                            </Grid>
                        </Hidden>

                        <Grid item xs={12}>
                            <Hidden xlDown={state.datosSesion.tipo>1}>
                                <OkProveedor soyProveedor={soyProveedor} setSoyProveedor={setSoyProveedor}/>
                            </Hidden>
                        </Grid>
                        
                        <div className={classes.inputAncho} hidden={!cargando}>
                            <LinearProgress />
                        </div>
                        <Grid item xs={12}>
                            <Button
                            type="submit"
                            className={classes.inputAncho}
                            size="large"
                            variant="contained"
                            color="primary"
                            disabled={cargando}>
                            {registrar?"Registrar Usuario":"Guardar cambios"}
                            </Button>
                        </Grid>
                        
                        <Grid item xs={12} hidden={!registrar}>
                            <InicioSesion mensaje={"¿Ya tienes una cuenta?"}/>
                        </Grid>
                    </Grid>
                </form>
                <AlertaMensaje mensaje={mensajeAlerta} abrir={abrir} setabrir={setabrir}/>
            </Paper>
        </div>
    );
}

function OkProveedor({setSoyProveedor, soyProveedor}) {
    const manejarCambio = (event) => {
        setSoyProveedor(!soyProveedor);
    };

    return (
        <FormControlLabel
            control={<Checkbox checked={soyProveedor} onChange={manejarCambio} name="checkedB" color="primary"/>}
            label="Soy proveedor de servicios"
        />
    );
}