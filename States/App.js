import React, { useReducer, createContext} from "react";
//window.location.origin
//import Icono from '/Icono3.png'

//Este componente nos sirve para obtener los datos del usuario de la sesión actual en otros componentes.
//servidor: es la ruta del servidor en donde se encuentra alojado el back-end del sistema
//ruta: es una porción de la ruta que utilizamos para poder visualizar el front-end de manera correcta
//jwt: JSON Web Token
//publico: utilizado en los componentes en donde se permite acceder sin estar logueado, para ello se lo setea en true
//imagen_predeterminada: es la ruta de la imagen que se muestra cuando el usuario no cargó una imagen, ya sea de perfil o de una publicación
//datosSesion: son todos los datos del usuario
const estadoInicial = {
    servidor: "https://prueba-3.herokuapp.com",
    ruta: "/App-Servicios",
    jwt:"",
    publico: false,
    guardar: false,
    imagen_predeterminada: "/App-Servicios/Icono4.png",
    datosSesion:{
        apellido: "",
        blocked: "",
        confirmed: false,
        created_at: "",
        descripcion: "",
        dni: "",
        email: "",
        estado: false,
        fecha_creacion: "",
        id: null,
        mostrar_telefono: false,
        nombre: "",
        permiso: 0,
        provider: "local",
        role: {
            id: 1, name: "Authenticated", 
            description: "Default role given to authenticated user.", 
            type: "authenticated"
        },
        telefono: "",
        tipo: 0,
        ubicacion: "",
        updated_at: "",
        username: "",
        identidad_verificada: false,
        imagenes_dni: []
    }
};

const reducer = (state, action) => {
    let valor = action.value;

    switch (action.type) {
        case "setDatos":
            return {...state, datosSesion: valor};
        case "setJwt":
            return {...state, jwt: valor};
        case "setGuardar":
            return {...state, guardar: valor};
        case "setPublico":
            return {...state, publico: valor};
        default:
            return { ...state };
    }
};

const ObtenerEstadoAplicacion = createContext(estadoInicial);

function ProveerEstadoAplicacion({ children }) {
    const [state, dispatch] = useReducer(reducer, estadoInicial);

    return (
        <ObtenerEstadoAplicacion.Provider value={{ state, dispatch }}>
            {children}
        </ObtenerEstadoAplicacion.Provider>
    );
}

export { ObtenerEstadoAplicacion, ProveerEstadoAplicacion };