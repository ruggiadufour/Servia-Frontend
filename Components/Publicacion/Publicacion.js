import React, {useEffect, useState, useContext} from 'react';

//Material-UI
import {Grid, Container} from '@material-ui/core/';
import {useParams} from 'react-router-dom'
import axios from 'axios'
//Componentes
import ProveedorInfo from './ProveedorInfo.js';
import PublicacionInfo from './PublicacionInfo.js';
import Opiniones from './Opiniones.js';
import {BotonContratar} from '../ContactarProveedor.js'

import { ObtenerEstadoAplicacion } from '../../Estados/AplicacionEstado'

//Componente que llama a los subcomponentes que debería tener una publicación, para mostrarlos
export default function Publicacion() {
    const { state } = useContext(ObtenerEstadoAplicacion);
    let { id } = useParams();
    const [datosPerfil, setdatosPerfil] = useState({
        id: null,
        descripcion:"",
        nombre:"",
        apellido:"",
        identidad_verificada: false,
        telefono: "",
        mostrar_telefono: false,
        pausado: false,
        bloqueado: false,
        servicios: [],
        imagen_perfil: ""
    })
    const [datosPagina, setdatosPagina] = useState({
        id: null,
        descripcion:"",
        titulo:"",
        precio_estimado: 0,
        tipo: false,
        pausado: false,
        bloqueado: false,
        imagenes: [],
        Usuario_id: null
    })

    //Traemos los datos de la publicación
    useEffect(()=>{
        if (state.jwt!=="" || state.publico===true){            
            axios.get(state.servidor+"/api/solicitud/"+id)
            .then(response => {
                obtenerUsuario(response.data)
            })
            .catch(error => {
                console.log("Un error ha ocurrido al buscar la solicitud.")
                console.log(error.response)
            }) 
        }
    },[state.jwt, state.publico])

    //Función que setea los datos de la publicación y del proveedor en variables que luego serán pasadas a los subcomponentes
    function obtenerUsuario(data){
        setdatosPagina({
            id: data.id,
            titulo: data.titulo,
            descripcion: data.descripcion,
            precio_estimado: data.precio_estimado,
            tipo: data.tipo,
            pausado: data.pausado,
            imagenes: data.imagenes,
            categoria: data.Categoria_id.nombre,
            servicio: data.tipo?data.Servicio_id.nombre:null,
            Usuario_id: data.Usuario_id,
            bloqueado: data.bloqueado,
            servicio_id: data.tipo?data.Servicio_id.id:null,
            updated_at: data.updated_at,
        })

        let auth = state.jwt!==""?'Bearer '+state.jwt:"";
        
        axios.get(
            state.servidor+"/users/"+data.Usuario_id.id,{
                headers: {
                'Authorization': auth
                },
            })
            .then(response => {
                setdatosPerfil({
                    id: response.data.id,
                    descripcion: response.data.descripcion,
                    titulo: `${response.data.nombre} ${response.data.apellido}`,
                    identidad_verificada: response.data.identidad_verificada,
                    telefono: response.data.telefono,
                    mostrar_telefono: response.data.mostrar_telefono,
                    servicios: response.data.servicios,
                    bloqueado: response.data.bloqueado,
                    pausado: response.data.estado,
                    imagen_perfil: response.data.imagen_perfil===null?null:response.data.imagen_perfil.url,
                })
            })
            .catch(error => {
                console.log("Un error ha ocurrido al buscar el usuario.")
                console.log(error.response)
            }) 
    }

    return (
        <Container style={{width: "95%"}}>
            <Grid container direction="row" justify="center" alignItems="stretch">
                <Grid item md={8} xs={12}>
                  <PublicacionInfo esDePerfil={false} datosPagina={datosPagina}/>
                  {datosPagina.tipo && <Opiniones datos={datosPagina}/>}
                </Grid>  

                {
                    datosPagina.tipo && (
                        <Grid item md={4} xs={12} >
                            <ProveedorInfo esDePerfil={false} datosPerfil={datosPerfil}/>
                        </Grid> 
                    )
                }
                {
                    //Si no es el dueño de la publicación, si no es un usuario en una solicitud de servicio
                    //y si el proveedor o la publicación no se encuentra pausada o bloqueada, entonces ofrecemos la posibilidad de contactarlo 
                    datosPerfil.id!==state.datosSesion.id && !datosPagina.pausado && !datosPagina.bloqueado && !datosPerfil.pausado && !datosPerfil.bloqueado &&
                    (datosPagina.tipo?true:state.datosSesion.tipo!==1) &&
                    <BotonContratar fijo={true} esDePerfil={false} datos={{idS: datosPagina.id, idP: datosPerfil.id, nombre: datosPerfil.titulo, imagen_perfil: datosPerfil.imagen_perfil}} />
                }
            </Grid>
        </Container>
    )
}
