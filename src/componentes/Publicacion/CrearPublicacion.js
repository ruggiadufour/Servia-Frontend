import React,{useState, useEffect} from 'react';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
//import {useDropzone} from 'react-dropzone';
import ImageGallery from 'react-image-gallery';
import SubirImagenes from '../SubirImagen.js';
import InputLabel from '@material-ui/core/InputLabel';

import Estilos from '../Estilos.js'; 

export default function CrearPublicacion({tipoPublicacion}) {
    const classes = Estilos();
    const [pictures,setPictures] = useState([]);

    const [precioPresupuesto, setPrecioPresupuesto] = useState("");
    const [titulo, setTitulo] = useState("");
    
    useEffect(()=>{
        //Dependiendo de si se quiere crear una publicación o solicitar un servicio, se muestra la pantalla correspodiente
        if(tipoPublicacion){
            setTitulo("Crear publicación");
            setPrecioPresupuesto("Precio estimado");
        }else{
            setTitulo("Solicitar servicio");
            setPrecioPresupuesto("Presupuesto");
        }
    },[])    

    function onDrop(pictureFiles, pictureDataURLs){
        setPictures(pictureFiles);
    }

  return (
    <div className={classes.fondo}>
        <Paper elevation={3}>
            <FormControl className={classes.padding2} color="primary" fullWidth>
                <Grid className={classes.pantallaMedia} container direction="row" justify="center" alignItems="center" spacing={1}>
                    <Grid item xs={12}>
                        <Typography variant="h5" component="h1" align="center">
                            {titulo}
                        </Typography>
                    </Grid>
                    
                    <Grid item sm={8} xs={12}>
                        <TextField className={classes.inputAncho} id="filled-basic" label="Título de la publicación" variant="filled" required/>
                    </Grid>

                    <Grid item sm={4} xs={12}>
                        <TextField className={classes.inputAncho} id="formatted-numberformat-input" value="$" label={precioPresupuesto} variant="filled"/>
                    </Grid>

                    <Grid item sm={6} xs={12}>
                        <FormControl className={classes.inputAncho}>
                            <InputLabel id="filled-basic"  variant="filled">Categoría</InputLabel>
                            <Select id="filled-basic" label="Categoría" variant="filled" required>
                                <MenuItem value={10}>Ten</MenuItem>
                                <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem>    
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item sm={6} xs={12}>
                        <FormControl className={classes.inputAncho}>
                            <InputLabel id="filled-basic" variant="filled">Servicio</InputLabel>
                            <Select id="filled-basic" label="Servicio" variant="filled" required>
                                <MenuItem value={10}>Ten</MenuItem>
                                <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem>    
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField className={classes.inputAncho} id="filled-basic" label="Descripción" multiline variant="filled" multiline/>
                    </Grid>

                    <Grid item xs={12} className={classes.inputAncho}>
                        <SubirImagenes/>
                    </Grid>

                    <Grid item xs={6} align="center">
                        <Button className={classes.botones} size="large" variant="contained" color="primary">Guardar</Button>
                    </Grid>
                    <Grid item xs={6} align="center">
                        <Button className={classes.botones} size="large" variant="contained" color="secondary">Cancelar</Button>
                    </Grid>
                </Grid>
            </FormControl>
        </Paper>
    </div>
  );
}