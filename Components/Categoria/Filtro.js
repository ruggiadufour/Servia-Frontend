import React,{useState, useEffect} from 'react';
//Material UI
import {Chip, Grid, TextField, Typography, Button, Card, FormControlLabel, Checkbox, CardContent} from '@material-ui/core/';
import {Done as Done, Clear as Clear} from '@material-ui/icons';

import Estilos from '../Estilos.js'

//Este es un subcomponente que se utiliza en el supercomponente Categoria.js, sirve para establecer un conjunto de filtros
//para buscar publicaciones.
//El componente acepta un conjunto de parámetros que son pasados por Categoria.js
export default function Filtro({tipoPublicacion, settipoPublicacion, servicios, agregarSeleccionado, buscarServicios, inputBusqueda, setinputBusqueda}) {
  const classes = Estilos();
  const [tipo,settipo] = useState(false)

  //Cuando la variable tipo cambia, se cambia la variable tipoPublicacion, esto para que repercuta en Categoria.js
  //indicando que se ha cambiado de tipo publicación a tipo solicitud
  useEffect(()=>{
    settipoPublicacion(!tipo)
  },[tipo])
  return (
    <Card className={classes.margenArriba} variant="outlined" className={classes.filaPublicacion}>
      <CardContent>
        <Typography variant="h5" component="h2">
          Seleccione los filtros deseados
        </Typography>

        <Grid item xs={12}>    
          <FormControlLabel
            className={classes.inputAncho}
            control={<Checkbox checked={tipo} name="tipo" onChange={(e)=>{settipo(e.target.checked)}}/>}
            label="Filtrar por publicaciones de solicitudes de servicios de usuarios."
          />
        </Grid>

        {
          tipoPublicacion &&
          <Grid container className={classes.margenArriba} spacing={2} justify="space-around" alignItems="center">    
            {
              servicios.map((servicio,i) => (
                <Grid item xs={6} sm={4} md={3} lg={2}  key={i}>
                  <SeleccionarServicio key={i} servicio={servicio} agregarSeleccionado={agregarSeleccionado}/>
                </Grid>
              ))
            }
          </Grid>
        }
        
        <TextField
          className={classes.margenArriba}
          value={inputBusqueda}
          color="secondary"
          onChange={(e)=>{setinputBusqueda(e.target.value)}}
          onKeyDown={(e)=>{if(e.key==='Enter'){buscarServicios()}}}
          label="Buscar por nombre" variant="outlined"
          size="medium" fullWidth
        />
        <Button onClick={buscarServicios} className={classes.margenArriba} color="secondary" variant="contained" >Buscar</Button>
      </CardContent>
    </Card>
  );
}

//Subcomponente de Filtro.js que permite seleccionar o deseleccionar un servicio.
//Se separa como un componente unico, ya que pueden existir mas de un servicio para seleccionar, por lo tanto
//se puede simplificar el codigo separandolos.
function SeleccionarServicio({servicio, agregarSeleccionado}) {
  const classes = Estilos();
  //Variables del componente
  const [hecho_noHecho, setHecho_noHecho] = useState(false);
  const [seleccion, setSeleccion] = useState(false);

  const handleClick = () => {
    agregarSeleccionado(servicio.id)
    if(seleccion===false){
      setSeleccion(true);
      setHecho_noHecho(true);
    }else{
      setSeleccion(false);
      setHecho_noHecho(false);
    }
  };

  return (
    <div className={classes.mostrarFlex}>
      <Chip clickable color="primary" label={servicio.nombre} icon={hecho_noHecho?<Done/>:<Clear/>} onClick={handleClick}/>
    </div>
  );
}