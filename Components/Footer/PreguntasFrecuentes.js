import React from 'react';
import { Typography, Paper, Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core/';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Estilos from '../Estilos';

//Componente que se muestra en la sección de preguntas frecuentes
export default function PreguntasFrecuentes() {
  const classes = Estilos();
  const [informacion, setinformacion] = React.useState([
    {
      pregunta: "¿Qué es Servia?",
      respuesta: "Servia es una aplicación en la cual vas a poder encontrar servicios domesticos, publicar tus servicios o solicitar un servicio determinado."
    },
    {
      pregunta: "¿Cómo busco un servicio?",
      respuesta: 'Para buscar un servicio, debes hacer click en la opcion "Explorar servicios", luego se mostrará una pagina donde podrás seleccionar la categoría referente al servicio que buscas, al hacer esto se abrirá una página donde podrás ver y buscar servicios.'
    },
    {
      pregunta: "¿Cómo me vuelvo proveedor de servicios?",
      respuesta: 'Para ser proveedor, debes seleccionar la opción "Quiero ser proveedor de servicios" al momento de registrarte o yendo a "Editar mi perfil".'
    },
    {
      pregunta: "Si soy un proveedor de servicios, ¿Cómo verifico mi identidad en Servia?",
      respuesta: 'Para verificar tu identidad, debes ir a la opcion "Verificar mi identidad", allí podrás cargar tu número de DNI y las fotos del mismo. Luego un administrador validará tus datos y te notificará los resultados.'
    },
    {
      pregunta: "¿De qué me sirve verificar mi identidad?",
      respuesta: 'Verificar tu identidad te sirve para mostrar un distintivo al lado de tu nombre que indica que tu perfil se encuentra verificado y que pertenece a una persona real.'
    },
    {
      pregunta: "¿Cómo me publicito en Servia?",
      respuesta: "Servia ofrece a los proveedores la posibilidad de crear publicaciones en donde pueden mostrar una descripción de sus servicio e imágenes que la acompañen."
    },
    {
      pregunta: "¿Cómo solicito un servicio?",
      respuesta: 'Para solicitar un servicio, debes ir a la opción "Solicitar servicio", allí podrás especificar todos los requerimientos, de modo de que algún proveedor se pueda contactar contigo para ayudarte.'
    },
    {
      pregunta: "¿Cómo administro las publicaciones/solicitudes que he hecho?",
      respuesta: 'Para administrar tus publicaciones/solicitudes, debes ir a la opcion "Mis servicios solicitados" o "Mis publicaciones", allí podrás modificar o eliminar las publicaciones/solicitudes que hiciste.'
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
    <div className={classes.fondo}>
      <Paper elevation={3} style={{margin:"auto",width:850, padding:"20px"}} className="Fondo">    
        <Typography component="h3" variant="h4" align="center">
            Preguntas frecuentes
        </Typography>
        <br/>
        <>
          {
            informacion.map((fila, i)=>(
              <Accordion key={i}>
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
      </Paper>
    </div>
  );
}