import React, { useState, Component, useEffect, useContext } from 'react';
import axios from 'axios'

//Componentes del chat (es una librería que se encontró)
import './EstiloChat.css'
import {
    ChatItem, 
    ChatList,
    MessageList,
    Input,
    Button,
    SideBar,
} from './ComponentesChat'; 
//Material UI
import {IconButton, Button as Boton, LinearProgress as Cargando} from '@material-ui/core/';
import Alerta from '@material-ui/lab/Alert';
import {KeyboardReturn as Atras, StarRate, TramRounded} from '@material-ui/icons/';

//Componentes
import AlertaSi_No from '../AlertaSi_No.js';
import AlertaMensaje from '../AlertaMensaje.js';
import you from './Miniatura.png'
import Estilos from '../Estilos.js'

//Obtenemos el estado global de la aplicación
import { ObtenerEstadoAplicacion } from '../../Estados/AplicacionEstado'

//Este componente nos permite implementar la interfaz de un chat en el sistema.
//Aquí se mostrarán los chats que un usuario (proveedor o cliente) posee. Estos chats se generan cada vez que un
//cliente contacta a un proveedor por medio de una publicación o cada vez que un proveedor contacta por medio de
//una solicitud a un cliente
//En cada chat se podrán enviar solamente mensajes. Si un usuario es proveedor de servicio, podrá enviar al cliente
//(por medio de su chat) una solicitud para que este haga una reseña sobre sus servicios 
export function Chat(){
    const classes = Estilos();
    const { state, dispatch } = useContext(ObtenerEstadoAplicacion);
    //Declaramos las viarables que se utilizarán en el componente
    const [cargando, setcargando] = useState(false)
    const [chats, setchats] = useState([])
    const [chatsOrdenados, setchatsOrdenados] = useState([])
    const [mensajes, setmensajes] = useState([]);
    const [chatSeleccionado, setchatSeleccionado] = useState(null);
    const [confirmacion, setconfirmacion] = useState(false);
    const [abrir, setabrir] = useState(false);
    const [deshabilitado, setdeshabilitado] = useState(false);
    const [contenido, setcontenido] = useState("");
    const [atras, setatras] = useState(false);
    
    //Cuando se renderiza por primera vez el componente Chat.js, se ejecuta la siguiente función
    useEffect(()=>{
        let auth = 'Bearer '+state.jwt;
        setcargando(true)
        if(state.jwt!==""){
            //Se obtienen todos lso chats del sistema y se filtran según el usuario que está logueado en el sistema,
            //de forma tal que  podemos listar los chats de este
            axios.get(state.servidor+"/api/chats/",{
                headers: {'Authorization': auth},
              })
            .then(response => {
                //Obtenemos todos los chats del sistema y filtramos segun el id de receptor o emisor
                let chats_ = response.data.filter(chat => (chat.receptor.id === state.datosSesion.id || chat.emisor.id === state.datosSesion.id))
                
                setchats(chats_.map((chat)=>{
                    //Obtenemos en una sola variable el nombre y apellido concatenados
                    let emisor = `${chat.emisor.nombre} ${chat.emisor.apellido}`
                    let receptor = `${chat.receptor.nombre} ${chat.receptor.apellido}`
                    //Si el emisor o receptor no tienen imagenes de perfil, entonces mostramos una predeterminada (el logo de Servia)
                    let img_emisor = chat.emisor.imagen_perfil===null?state.imagen_predeterminada:state.servidor+chat.emisor.imagen_perfil.url
                    let img_receptor = chat.receptor.imagen_perfil===null?state.imagen_predeterminada:state.servidor+chat.receptor.imagen_perfil.url
                    
                    //Establecemos el objeto de mensaje (de la interfaz), con los mensajes del respectivo chat
                    let msjs = chat.mensajes.map((mensaje)=>({
                        position: mensaje.enviado_por?'right':'left',
                        forwarded: false,
                        replyButton: false,
                        reply: null,
                        meeting: null,
                        type: "text",
                        theme: 'white',
                        view: 'list',
                        title: mensaje.enviado_por?emisor:receptor,
                        titleColor: "#EB7887",
                        text: mensaje.contenido,
                        onLoad: () => {
                            console.log('Photo loaded');
                        },
                        status: null,
                        date: new Date(mensaje.created_at),
                        onReplyMessageClick: () => {
                            console.log('onReplyMessageClick');
                        },
                        avatar: mensaje.enviado_por?img_emisor:img_receptor,
                    }
                    ))
                    let img_categoria = null
                    let img_solicitud = null
                    //Como la generación de un chat puede estar referido al contacto por medio de una solicitud,
                    //o por medio de un perfil, necesitamos saber cual es la situación, entonces, sabiendo que si
                    //solicitud es null, entonces el chat se ha generado por medio de un perfil y viceversa.
                    if (chat.solicitud===null){
                        img_categoria = chat.categoria.imagen===null?state.imagen_predeterminada:state.servidor+chat.categoria.imagen.url
                    }else{
                        img_solicitud = chat.solicitud.imagenes.length===0?state.imagen_predeterminada:state.servidor+chat.solicitud.imagenes[0].url
                    }
                    
                    return {
                        chat:{
                            id: chat.id,
                            avatar: chat.solicitud===null?img_categoria:img_solicitud,
                            avatarFlexible: true,
                            statusColor: 'lightgreen',
                            statusColorType: 'encircle',
                            alt: "Imagen de perfil",
                            title: chat.solicitud===null?chat.categoria.nombre:chat.solicitud.titulo,
                            date: new Date(chat.mensajes[chat.mensajes.length-1].created_at),
                            subtitle: chat.mensajes[chat.mensajes.length-1].contenido,
                            unread: state.datosSesion.id===chat.emisor.id?chat.noleido_emisor:chat.noleido_receptor,
                            mensajes: msjs,
                            emisor: chat.emisor,
                            receptor: chat.receptor,
                            noleido_emisor: chat.noleido_emisor,
                            noleido_receptor: chat.noleido_receptor,
                            categoria: chat.categoria,
                            solicitud: chat.solicitud,
                            peticion: chat.peticion
                        }
                    }
                }))
                setcargando(false)
            })
            .catch(error => {
                console.log("Un error ha ocurrido al cargar los chats.")
                console.log(error.response)
            }) 
        }
    },[state.jwt])

    //Cuando obtenemos todos los chats del usuario logueado, para no dejar un espacio vacío en el lugar donde
    //se encuentran los mensajes de un chat, seleccionamos el primer chat para mostrar su contenido.
    //Esto es mejor cambiarlo, mostrando otra cosa en lugar de un chat.
    useEffect(()=>{
        if(chats.length!==0){
            setchatSeleccionado(chats[0].chat)
            setmensajes(chats[0].chat.mensajes)
        }
    },[chats])

    //Cuando se envia una petición de reseña, entonces se pone desabilitado en true
    useEffect(() => {
        if (chatSeleccionado!==null && chatSeleccionado.peticion)
            setdeshabilitado(true)
    }, [chatSeleccionado])

    //Cuando se selecciona un chat, hay que actualizar los mensajes con los del chat seleccionado, el siguiente método hace eso.
    function actualizarMensajes(chat){
        if(!cargando){
            setcargando(true)
            setmensajes(chat.mensajes)//Se setean los mensajes del chat seleccioando
            setchatSeleccionado(chat)//Se setea el chat seleccionado en una nueva variable para poder utilizar su información en otros lugares
            setatras(false)
            let auth = 'Bearer '+state.jwt;

            //Si abrimos el chat debemos actualizar el valor de los mensajes no leidos a 0
            let obj_leido = {}
            if(state.datosSesion.id===chat.emisor.id){
                obj_leido["noleido_emisor"] = 0
            }else{
                obj_leido["noleido_receptor"] = 0
            }
            axios.put(state.servidor+"/api/chats/"+chat.id,obj_leido,{
                headers: {'Authorization': auth},
            }).then(response => {
            })
            //-----------------------------------------------------------------------------------//

            //Buscamos todos los mensajes del chat seleccionado
            axios.get(state.servidor+"/api/chats/"+chat.id,{
                headers: {'Authorization': auth},
            })
            .then(response => {
                //Obtenemos en una sola variable el nombre y apellido concatenados
                let emisor = `${response.data.emisor.nombre} ${response.data.emisor.apellido}`
                let receptor = `${response.data.receptor.nombre} ${response.data.receptor.apellido}`
                //Si el emisor o receptor no tienen imagenes de perfil, entonces mostramos una predeterminada (el logo de Servia)
                let img_emisor = response.data.emisor.imagen_perfil===null?state.imagen_predeterminada:state.servidor+response.data.emisor.imagen_perfil.url
                let img_receptor = response.data.receptor.imagen_perfil===null?state.imagen_predeterminada:state.servidor+response.data.receptor.imagen_perfil.url
                
                //Establecemos el objeto de mensaje (de la interfaz), con los mensajes del respectivo chat
                let msjs = response.data.mensajes.map((mensaje, i)=>({
                    position: mensaje.enviado_por?'right':'left',
                    forwarded: false,
                    replyButton: false,
                    reply: null,
                    meeting: null,
                    type: "text",
                    theme: 'white',
                    view: 'list',
                    title: mensaje.enviado_por?emisor:receptor,
                    titleColor: "#EB7887",
                    text: mensaje.contenido,
                    onLoad: () => {
                        console.log('Photo loaded');
                    },
                    status: null,
                    date: new Date(mensaje.created_at),
                    onReplyMessageClick: () => {
                        console.log('onReplyMessageClick');
                    },
                    avatar: mensaje.enviado_por?img_emisor:img_receptor,
                }
                ))
                setmensajes(msjs)//Actualizamos los mensajes y demás variables
                setdeshabilitado(response.data.peticion)
                setcargando(false)
            })
            .catch(error => {
                console.log("Un error ha ocurrido al cargar los mensajes.")
                console.log(error.response)
            }) 
        }
    }

    //Función que se ejecuta cuando se envia un mensaje a un chat
    function agregarMensaje() {
        let auth = 'Bearer '+state.jwt;
        if(chatSeleccionado!==null){
            let emisor = `${chatSeleccionado.emisor.nombre} ${chatSeleccionado.emisor.apellido}`
            let receptor = `${chatSeleccionado.receptor.nombre} ${chatSeleccionado.receptor.apellido}`
            let img_emisor = chatSeleccionado.emisor.imagen_perfil===null?state.imagen_predeterminada:state.servidor+chatSeleccionado.emisor.imagen_perfil.url
            let img_receptor = chatSeleccionado.receptor.imagen_perfil===null?state.imagen_predeterminada:state.servidor+chatSeleccionado.receptor.imagen_perfil.url

            //Se actualiza el arreglo de mensajes
            setmensajes([...mensajes, {
                position: state.datosSesion.id===chatSeleccionado.emisor.id?'right':'left',
                forwarded: false,
                replyButton: false,
                reply: null,
                meeting: null,
                type: "text",
                theme: 'white',
                view: 'list',
                title: state.datosSesion.id===chatSeleccionado.emisor.id?emisor:receptor,
                titleColor: "#EB7887",
                text: contenido,
                onLoad: () => {
                    console.log('Photo loaded');
                },
                status: null,
                date: new Date(),
                onReplyMessageClick: () => {
                    console.log('onReplyMessageClick');
                },
                avatar: state.datosSesion.id===chatSeleccionado.emisor.id?img_emisor:img_receptor,
            }])
            //Se envía un nuevo mensaje al emisor o receptor
            axios.post(state.servidor+"/api/mensajes/",{
                chat: chatSeleccionado.id,
                enviado_por: state.datosSesion.id===chatSeleccionado.emisor.id,
                contenido: contenido,
            },{
                headers: {'Authorization': auth},
            })
            .then(response => {
            })
            .catch(error => {
                console.log("Un error ha ocurrido al cargar los mensajes.")
                console.log(error.response)
            }) 

            //------------------------------------------------------------------------
            let obj_noleido = {}
            //Si se envia un mensaje, entonces aumentamos la cantidad de mensajes no leidos, ya sea del receptor como emisor
            if(state.datosSesion.id===chatSeleccionado.emisor.id){
                //Si el emisor es el usuario logueado, entonces aumentamos la cantidad de mensajes no leidos al receptor
                obj_noleido["noleido_receptor"] = chatSeleccionado.noleido_receptor+1
                let vari = chatSeleccionado
                vari.noleido_receptor++
                setchatSeleccionado(vari)
            }else{
                //Si el receptor es el usuario logueado, entonces aumentamos la cantidad de mensajes no leidos al emisor
                obj_noleido["noleido_emisor"]= chatSeleccionado.noleido_emisor+1
                let vari = chatSeleccionado
                vari.noleido_receptor++
                setchatSeleccionado(vari)
            }
            axios.put(state.servidor+"/api/chats/"+chatSeleccionado.id,obj_noleido,{
                headers: {'Authorization': auth},
            }).then(response => {
            })
        }
    }

    //Se envia una notificación a un usuario indicando de que un proveedor le está solicitando una reseña de un servicio
    function enviarNotificacion(boole){
        setconfirmacion(false)
        if (boole){
            let auth = 'Bearer '+state.jwt;
            //Seteamos los ids de emisores y receptores de la notificación
            let emisor = chatSeleccionado.receptor.id
            let receptor = chatSeleccionado.emisor.id
            
            if (chatSeleccionado.solicitud!==null){
                //Si el tipo de la solicitud es false, significa que es una solicitud y que el emisor de la notificación es el emisor del chat
                if (!chatSeleccionado.solicitud.tipo){
                    emisor = chatSeleccionado.emisor.id
                    receptor = chatSeleccionado.receptor.id
                }
            }
            axios.post(
                //Se establecen los datos de la notificación
                state.servidor+"/api/notificaciones/",{
                    tipo: 2,
                    emisor: emisor,
                    receptor: receptor,
                    solicitud: chatSeleccionado.solicitud===null?null:chatSeleccionado.solicitud.id,
                    datos_notificacion: chatSeleccionado.categoria===null?"":String(chatSeleccionado.categoria.id+"_"+chatSeleccionado.categoria.nombre),
                    leido: false
                },
                {headers: {'Authorization': auth},})
            .then(response => {
                let auth = 'Bearer '+state.jwt;

                //Actualizamos el estado de la petición del chat, para que el botón de enviar solicitud esté bloqueado
                axios.put(state.servidor+"/api/chats/"+chatSeleccionado.id,{
                    peticion: true
                },{
                    headers: {'Authorization': auth},
                }).then(response => {
                    setdeshabilitado(true)
                })
                setabrir(true)
            })
            .catch(error => {
                console.log("Error, no se ha podido crear la notificacion.", error.response)
                console.log("Error, no se ha podido crear la notificacion.")
            })
        }
    }

    return (
        <div className='container' >
            <div className='chat-list' className={atras?classes.EstiloMovil:classes.EstiloPC}>
                <SideBar
                    top={
                        <div>
                            
                        </div>
                    }
                    center={
                        <ChatList className='chat-list' onClick={(e)=>{actualizarMensajes(e)}} dataSource={chats.map(chat=>(chat.chat))}/>
                    }
                    bottom={
                        <div>
                            
                        </div>
                    }/>
            </div>
            <IconButton
                className={classes.EstiloMovil}
                style={{
                    position: atras?"relative":"absolute",
                    left: "0px",
                    top: "70px",
                    zIndex: 100,
                }}
                onClick={()=>{setatras(!atras)}}
            >
                <Atras/>
            </IconButton>
            <div className={atras?classes.EstiloPC:classes.EstiloVacio} className='right-panel'>
                {
                    cargando && <Cargando/>
                }
                {
                    !cargando && chats.length===0 && (<Alerta className={classes.inputAncho} style={{marginTop:"15px"}} variant="outlined" severity="info">
                        No tienes ningún chat aún.
                    </Alerta>)                    
                }
                {
                    chatSeleccionado!==null &&
                        <ChatItem
                            avatar={chatSeleccionado.avatar}
                            alt={'Reactjs'}
                            title={chatSeleccionado.title}
                            subtitle={chatSeleccionado.emisor.id===state.datosSesion.id?
                                `${chatSeleccionado.receptor.nombre} ${chatSeleccionado.receptor.apellido}`:
                                `${chatSeleccionado.emisor.nombre} ${chatSeleccionado.emisor.apellido}`}
                            date={null}
                            unread={0}
                        />
                }
                {
                    //Se hacen un conjunto de condiciones para mostrar o no el botón de solicitud de reseña
                    //Si el chat no esta relacionado a una solicitud el botón no se muestra, tampoco se muestra el botón al propio
                    //proveedor de servicios, tampoco si la publicación es de tipo solicitud,
                    !cargando && chatSeleccionado!==null && !atras &&
                    (chatSeleccionado.solicitud===null?(chatSeleccionado.receptor.id===state.datosSesion.id):
                    (chatSeleccionado.solicitud.tipo?chatSeleccionado.receptor.id===state.datosSesion.id:chatSeleccionado.emisor.id===state.datosSesion.id)) &&
                        <div>
                            <Boton disabled={deshabilitado} onClick={()=>setconfirmacion(true)} color="primary" className={classes.BotonSolicitar} variant="contained">
                                Petición de reseña
                            </Boton>
                            <Boton disabled={deshabilitado} onClick={()=>setconfirmacion(true)} color="primary" className={classes.BotonSolicitarMovil} variant="contained">
                                <StarRate/>
                            </Boton>
                        </div>
                }
                {
                    confirmacion &&
                    <AlertaSi_No
                    mensaje="Esta acción solo se debe realizar cuando ya se haya cumplido con el servicio pactado. ¿Está seguro que quiere enviar la petición?"
                    funcionAceptar={enviarNotificacion}
                    titulo="Enviar petición de reseña al cliente"/> 
                }
                <AlertaMensaje mensaje="¡Petición de reseña enviada!" setabrir={setabrir} abrir={abrir}/>
                <MessageList
                    className='message-list'
                    lockable={true}
                    downButtonBadge={10}
                    dataSource={mensajes}
                />
                {
                    chatSeleccionado!==null &&
                    <Input
                    placeholder="Escribe tu mensaje."
                    defaultValue=""
                    onChange={(e)=>{setcontenido(e.target.value)}}
                    //ref='input'
                    multiline={true}
                    onKeyPress={(e) => {
                        if (e.shiftKey && e.charCode === 13) {
                            return true;
                        }
                        if (e.charCode === 13) {
                            agregarMensaje();
                            e.preventDefault();
                            return false;
                        }
                    }}
                    rightButtons={
                        <Button
                            color='white'
                            backgroundColor='black'
                            text='Enviar'
                            onClick={()=>{agregarMensaje()}} />
                    } />
                }
            </div>
        </div>
    );
    
}

export default Chat;
