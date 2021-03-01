import {useState} from 'react'

import { Typography, Paper, Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core/';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

//Componente que se muestra en la sección de preguntas frecuentes
export default function PreguntasFrecuentes() {
  const [informacion, setinformacion] = useState([
    {
      pregunta: "¿Qué es Servia?",
      respuesta: "Servia es una aplicación en la cual vas a poder encontrar servicios domesticos, publicar tus servicios o solicitar un determinado servicio."
    },
    {
      pregunta: "¿Qué es un perfil de proveedor?",
      respuesta: "Un perfil de proveedor comprende toda la información de un determinado proveedor, por ejemplo, su nombre, apellido, descripcion, servicios que ofrece, etc."
    },
    {
      pregunta: "¿Qué es una publicación?",
      respuesta: "Una publicación es sencillamente un determinado servicio que un proveedor ofrece, éstas están hechas para que los demás usuarios vean las capacidades del proveedor."
    },
    {
      pregunta: "¿Qué es una solicitud?",
      respuesta: "Una solicitud es un servicio requerido por un usuario (no un proveedor), con el fin de que algún proveedor pueda satisfacer ese servicio."
    },
    {
      pregunta: "¿Cómo busco un servicio?",
      respuesta: 'En servia podés buscar a un proveedor de servicios por medio de su perfil o por medio de sus publicaciones. Por defecto, las búsquedas son por publicaciones, sin embargo, podés cambiar los filtros a traves del ícono 🚩, allí podrás configurar los filtros que se ajusten a tus necesidades. Una vez aplicados los filtros tenés que hacer click en el ícono 🔎, y en el caso de que haya resultados, estos se mostrarán en pantalla.'
    },
    {
      pregunta: "¿Cómo me vuelvo proveedor de servicios?",
      respuesta: 'Para ser proveedor, debés registrarte como proveedor seleccionando la opción "👷‍♂️ Soy proveedor de servicios", o si tu cuenta ya está creada tenés que hacer click en el ícono de perfil que tiene un 🔨, luego seleccionar la opción "👨‍🔧 Modificar mi perfil" y por ultimo seleccionar la opción "👷‍♂️ Soy proveedor de servicios" y guardar los cambios.'
    },
    {
      pregunta: "Si soy un proveedor de servicios, ¿Cómo verifico mi identidad en Servia?",
      respuesta: 'Para verificar tu identidad, tenés que hacer click en el ícono de perfil que tiene un 🔨, luego debés ir a la opcion "🕵️‍♂️ Verificar mi identidad", allí podrás cargar tu número de DNI y las fotos del mismo. Luego un administrador validará tus datos y te notificará los resultados.'
    },
    {
      pregunta: "¿De qué me sirve verificar mi identidad?",
      respuesta: 'Verificar tu identidad te sirve para mostrar un distintivo al lado de tu nombre que indica que tu perfil se encuentra verificado y que pertenece a una persona real.'
    },
    {
      pregunta: "¿Cómo me publicito en Servia?",
      respuesta: 'Servia ofrece a los proveedores la posibilidad de crear publicaciones en donde pueden mostrar una descripción de sus servicio e imágenes que la acompañen. Para crear publicaciones debés hacer click en el ícono 🍔, luego seleccionar la opción "🛠 Crear publicación".'
    },
    {
      pregunta: "¿Cómo solicito un servicio?",
      respuesta: 'Servia ofrece a los proveedores la posibilidad de crear publicaciones en donde pueden mostrar una descripción de sus servicio e imágenes que la acompañen. Para crear publicaciones debés hacer click en el ícono 🍔, luego seleccionar la opción "🙋‍♂️ Solicitar servicio".'
    },
    {
      pregunta: "¿Cómo administro las publicaciones/solicitudes que he hecho?",
      respuesta: 'Para administrar tus publicaciones/solicitudes, debés hacer click en el ícono 🍔, luego seleccionar la opción "🙋‍♂️ Solicitar servicio" o "🛠 Crear publicación".'
    },
    {
      pregunta: "¿Cómo contacto a un proveedor de servicios?",
      respuesta: 'Para contactar a un proveedor de servicios, debes ir a la publicacion del servicio que deseas y hacer click en la opción "Contactar". Al hacer click en el boton "Enviar", se generará un Chat en el cual el proveedor podrá responderte.'
    },
    {
      pregunta: "¿Cómo me mantengo en contacto con un proveedor de servicios?",
      respuesta: "Para mantenerte en contacto con uno o varios proveedores existe un chat, el cual tendrá los chats con los proveedores que hiciste contacto. Par accederlo debes hacer click en el ícono de mensaje, al lado de la campana de notificaciones."
    },
  ])

  return (
    <div className="centering-t general-width">
        
        <Typography component="h3" variant="h4" align="center">
            Preguntas frecuentes
        </Typography>
        <br/>
        <>
          {
            informacion.map((fila, i)=>(
              <Accordion key={i} className="m-15">
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                  <Typography  component="h6" variant="h6">{fila.pregunta}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    {fila.respuesta}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))
          }
        </>
     
    </div>
  );
}