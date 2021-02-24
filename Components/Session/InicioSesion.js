import React, {useContext, useState} from 'react';
//Material UI 
import {Grid, Link as LinkMUI,  LinearProgress, Modal, Backdrop, Fade, Typography, TextField, Hidden, Button, Divider, } from '@material-ui/core';

//Librerias
import {Link} from "react-router-dom";
import axios from 'axios'

import Estilos from '../Estilos.js'
import { ObtenerEstadoAplicacion } from '../../Estados/AplicacionEstado'

//Componente utilizado para cuando se quiere iniciar sesión
export default function IniciarSesion({mensaje}) {
  const classes = Estilos();
  const { state, dispatch } = useContext(ObtenerEstadoAplicacion);
  const [open, setOpen] = useState(false);
  const [cargando, setcargando] = useState(false);
  const [alerta, setalerta] = useState("");
  const [pwd_olvidada, setpwd_olvidada] = useState(false);

  //Los datos inician vacíos
  const [datos, setdatos] = useState({
    email:"",
    contrasena:""
  });

  //Funcionamiento de la ventana modal
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  
  //Ejecutado cada vez que se ingresa algún valor en los campos
  const cambiarInput = (e) =>{   
    let valor = e.target.value;
    let campo = e.target.name;
    setdatos({
        ...datos,
        [campo]: valor
    })        
  }
  
  //Función ejecutada al presionar el botón de iniciar sesión
  const iniciarSesion = () =>{
    setcargando(true)

    if(!pwd_olvidada){
      axios
      .post(state.servidor+"/auth/local/", {
        identifier: datos.email,
        password: datos.contrasena
      })
      .then(response => {
          // Se inició sesión correctamente, entonces se setean los datos del usuario en la sesión actual
          dispatch({type:"setDatos", value: response.data.user})
          dispatch({type:"setJwt", value: response.data.jwt})
          dispatch({type:"setPublico", value: false})
          localStorage.setItem('datosLocal', JSON.stringify({
            jwt: response.data.jwt,
            datosSesion: response.data.user
          }));
          setcargando(false)
          setOpen(false)
      })
      .catch(error => {
        // Ocurrió un error
        let err = JSON.parse(error.response.request.response).message[0].messages[0].id;
        console.log("Error: ",err)
        if(err==="Auth.form.error.invalid")
          setalerta('Correo o contraseña incorrectos');
        setcargando(false)
      });
    }else{
      //Si se olvidó la contraseña...
      console.log(datos)
      axios
      .post(state.servidor+'/auth/forgot-password', {
        email: datos.email,
      },{
        headers:{
          "Content-Type": "application/json"
        }
      })
      .then(response => {
        console.log('Your user received an email', response.data);
      })
      .catch(error => {
        // Handle error.
        console.log('An error occurred:', error.response);
      });
    }
    
  }

  return (
    <div>
      <LinkMUI href="#" style={{color:"black",padding: "10px"}} onClick={handleOpen}>
        {mensaje}
      </LinkMUI>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.mostrarFlex}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.papelFondo}>
            <div className="Fondo"  style={{maxWidth:350}}>
                <Grid  container direction="row" justify="center"  spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h5" component="h1" align="center" className={classes.form}>
                      {pwd_olvidada?"Recuperar contraseña":"Iniciar Sesión"}
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      onChange={cambiarInput}
                      name="email"
                      value={datos.email}
                      className={classes.inputAncho}
                      id="filled-basic"
                      label="Correo electrónico"
                      variant="filled"
                      required
                    />
                  </Grid>
                  <Divider/>
                  
                  <Grid item xs={12}>
                    {
                      !pwd_olvidada && <TextField
                        onChange={cambiarInput}
                        name="contrasena"
                        value={datos.contrasena}
                        required
                        type="password"
                        label="Contraseña"
                        variant="filled"
                        style={{marginTop:"15px"}}
                        className={classes.inputAncho}
                      />
                    }
                  </Grid>


                  <Hidden xlDown={mensaje===""}>
                    <Typography color="error">
                        {alerta}
                    </Typography>
                  </Hidden>

                  <Grid item xs={12} align="center">
                    {
                      !pwd_olvidada && <LinkMUI className={classes.margenArriba} href="#" onClick={()=>{setpwd_olvidada(true)}}>
                        Olvidé mi contraseña
                      </LinkMUI>
                    }
                  </Grid>
                  
                  <Grid item xs={12} align="center">
                    {
                      pwd_olvidada && <LinkMUI color="error" className={classes.margenArriba} href="#" onClick={()=>{setpwd_olvidada(false)}}>
                        Cancelar
                      </LinkMUI>
                    }
                  </Grid>

                  <div className={classes.inputAncho} hidden={!cargando}>
                    <LinearProgress />
                  </div>

                  <Grid item xs={12} align="center">
                    <Button
                      onClick={iniciarSesion}
                      size="large"
                      variant="contained"
                      color="primary">
                        {
                          !pwd_olvidada?"Iniciar Sesión":"Recuperar"
                        }
                    </Button>
                  </Grid>

                  <Divider/>
                  
                  <Grid item xs={12}>
                    {
                      !pwd_olvidada && <Typography onClick={handleClose} variant="body1" align="center">
                        {`¿Eres nuevo en el sitio? `}
                        <Link to={state.ruta+"/registrar"}>Crear cuenta</Link>
                      </Typography>
                    }
                  </Grid>
                </Grid>
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}