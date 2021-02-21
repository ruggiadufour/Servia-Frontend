import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios'
import PropTypes from 'prop-types';

//Material UI
import { makeStyles } from '@material-ui/core/styles';
import {Container, AppBar, Backdrop, CircularProgress, Box, Tab, Tabs} from '@material-ui/core';
import Nuevo from '@material-ui/icons/Announcement';
import Reloj from '@material-ui/icons/QueryBuilder';
import Check from '@material-ui/icons/AssignmentTurnedIn';


import GestionarReportes from './GestionarReportes.js'
//Variables globales de la aplicación
import { ObtenerEstadoAplicacion } from '../../Estados/AplicacionEstado'

//Función extraída de Material UI para mostrar las secciones del Tab
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};
function a11yProps(index) {
  return {
    id: `scrollable-force-tab-${index}`,
    'aria-controls': `scrollable-force-tabpanel-${index}`,
  };
}
//Hasta aquí código copiado para el Tab

//Estilos para PestanaReportes
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    padding: 10,
    minHeight:"calc(100vh - 130px)",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

export default function PestanaReportes() {
  const classes = useStyles();
  const { state, dispatch } = useContext(ObtenerEstadoAplicacion);

  //Variables del componente
  const [cargando, setcargando] = useState(false);
  const [value, setValue] = useState(0);
  const [reportes, setreportes] = useState([]);

  //Función que sirve para manejar el cambio de la sección del Tab
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  //Funcion que se ejecuta en el primer renderizado del componente, trae todos los reportes que existen
  useEffect(()=>{
    if (state.jwt!=="" || state.publico===true){
        setcargando(true)
        let auth = 'Bearer '+state.jwt;
        //Solicitamos a la API todos los reportes
        axios.get(state.servidor+"/api/reportes",{
          headers: {'Authorization': auth}})
        .then(response => {
          setreportes(response.data)
          setcargando(false)
        })
        .catch(error => {
          console.log("Un error ha ocurrido al cargar las categorías.")
          console.log(error.response)
        })
    }
  },[state.jwt, state.publico])

  //Función que sirve para modificar un determinado reporte y actualizarlo en la lista actual de reportes
  function modificarReporte(report){
    setreportes(
      reportes.map((reporte)=>{
        if(report.id===reporte.id){
          return report
        }else{
          return reporte
        }
    }))
  }

  return (
    <div className={classes.root} style={{padding:"20px"}} className="fondo">
      <Container>
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={handleChange}
            variant="fullWidth"
            scrollButtons="auto"
            indicatorColor="primary"
            textColor="primary"
            aria-label="scrollable force tabs example"
          >
            <Tab label="Gestionar nuevos reportes" icon={<Nuevo />} {...a11yProps(0)} />
            <Tab label="Reportes en espera" icon={<Reloj />} {...a11yProps(1)} />
            <Tab label="Historial de reportes" icon={<Check />} {...a11yProps(2)} />
          </Tabs>
        </AppBar>
        <Backdrop className={classes.backdrop} open={cargando}>
          <CircularProgress/>
        </Backdrop>
        <TabPanel value={value} index={0}>
          <GestionarReportes estadoReporte={0} cargando={cargando} modificarReporte={modificarReporte} reportes={reportes.filter((reporte)=>(reporte.estado<=0))}/>
        </TabPanel>

        <TabPanel value={value} index={1}>
          <GestionarReportes estadoReporte={1} cargando={cargando} modificarReporte={()=>{}} reportes={reportes.filter((reporte)=>(reporte.estado===1))}/>
        </TabPanel>

        <TabPanel value={value} index={2}>
          <GestionarReportes estadoReporte={2} cargando={cargando} modificarReporte={()=>{}} reportes={reportes.filter((reporte)=>(reporte.estado>=2))}/>
        </TabPanel>
      </Container>
    </div>
  );
}
