import React, {useEffect, useState, useContext} from 'react';
import {useParams} from 'react-router-dom'
import axios from 'axios'
//Material-UI
import {Grid, Container} from '@material-ui/core/';

import ProveedorInfo from '../Publicacion/ProveedorInfo.js';
import PublicacionInfo from '../Publicacion/PublicacionInfo.js';
import {BotonContratar} from '../ContactarProveedor.js'
import { ObtenerEstadoAplicacion } from '../../Estados/AplicacionEstado' 

//Componente que muestra los datos del perfil de un proveedor
export default function MiPerfil() {
    const { state } = useContext(ObtenerEstadoAplicacion);
    let { id } = useParams();
    const [datosPagina, setdatosPagina] = useState({
        descripcion:"",
        titulo:"",
        identidad_verificada: false,
        telefono: "",
        mostrar_telefono: false,
        servicios: [],
        imagenes: [],
        bloqueado: false,
        imagen_perfil: "",
        //Datos de publicación
        precio_estimado: "perfil",
        pausado: false,
        tipo: false,
        categoria:"",
        servicio:"",
        estrella: 0,
    })
    
    useEffect(()=>{
        if (state.jwt!=="" || state.publico===true){
            let auth = state.jwt!==""?'Bearer '+state.jwt:"";
            //Traemos los datos del usuario en cuestión
            axios.get(
            state.servidor+"/users/"+id,{
                headers: {
                'Authorization': auth
                },
            })
            .then(response => {
                //Seteamos los datos que nos interesan
                setdatosPagina({
                    id: response.data.id,
                    descripcion: response.data.descripcion,
                    titulo: `${response.data.nombre} ${response.data.apellido}`,
                    identidad_verificada: response.data.identidad_verificada,
                    telefono: response.data.telefono,
                    mostrar_telefono: response.data.mostrar_telefono,
                    servicios: response.data.servicios,
                    imagenes: response.data.imagenes_proveedor,
                    bloqueado: response.data.bloqueado,
                    pausado:  response.data.estado,
                    precio_estimado: "perfil",
                    imagen_perfil: response.data.imagen_perfil===null?null:response.data.imagen_perfil.url
                })
            })
            .catch(error => {
                console.log("Un error ha ocurrido al buscar el usuario.")
                console.log(error.response)
            }) 
        }
    },[state.jwt, state.publico])

    return (
        <Container>
            <Grid container direction="row" justify="center" alignItems="stretch">
                <Grid item md={8} xs={12} >
                    <PublicacionInfo esDePerfil={true} datosPagina={datosPagina}/>
                </Grid> 
                <Grid item md={4} xs={12} >
                    <ProveedorInfo esDePerfil={true} datosPerfil={datosPagina}/>
                </Grid>
                {
                    //Si no es el proveedor que se está viendo, tiene servicios para ofrecer y el proveedor no está bloqueado ni pausado, ofrecemos la posibilidad de contactarse
                    datosPagina.id!==state.datosSesion.id &&
                    datosPagina.servicios.length!==0 &&
                    !datosPagina.pausado &&
                    !datosPagina.bloqueado &&
                    <BotonContratar
                    fijo={true}
                    esDePerfil={true}
                    datos={{idS: null, idP: datosPagina.id, nombre: datosPagina.titulo, servicios: datosPagina.servicios}}/>
                }
            </Grid>
        </Container>
    )
}