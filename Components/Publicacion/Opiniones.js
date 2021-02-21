import React,{useState, useEffect, useContext} from 'react';
import axios from 'axios'

//Material UI
import {Tooltip, Button, Typography, Paper, Grid, Chip} from '@material-ui/core/';
import Alerta from '@material-ui/lab/Alert';
import {ThumbUpAltTwoTone as Like, ThumbDownAltTwoTone as Dislike} from '@material-ui/icons';

import Estrellas from '../Estrellas.js';
import Estilos from '../Estilos.js';
import { ObtenerEstadoAplicacion } from '../../Estados/AplicacionEstado'
import { format, register } from 'timeago.js';

//Subcomponente que muestra las reseñas que tiene una determinada publicación en función del servicio que ofrece
export default function Opiniones({datos}) {
    const classes = Estilos();
    const { state } = useContext(ObtenerEstadoAplicacion);
    const [opiniones, setopiniones] = useState([])
    const [promedioEstrellas, setpromedioEstrellas] = useState(0)

    //Traemos las reseñas que coincidan con el id del proveedor y el servicio que ofrece en la publicación
    useEffect(()=>{
        if (state.jwt!=="" || state.publico){  
            if(datos.Usuario_id!==null){
                axios.get(state.servidor+"/api/resenas?proveedor="+datos.Usuario_id.id+"&servicios="+datos.servicio_id)
                .then(response => {
                    setopiniones(response.data)
                    let total = 0;
                    response.data.map(opi => {
                        total+= opi.recomendacion
                    })
                    //Calculamos el promedio de la puntuación de las reseñas
                    setpromedioEstrellas(total/(response.data.length))
                })
                .catch(error => {
                    console.log("Un error ha ocurrido al buscar la solicitud.")
                    console.log(error.response)
                })
            }
        }
    },[state.jwt, state.publico, datos])
    //Seteamos cómo se mostrará el "hace cuanto tiempo" se hizo la reseña
    const localeFunc = (number, index, totalSec) => {
        return [
        ['justo ahora', 'justo ahora'],
        ['hace %s segundos', 'en %s segundos'],
        ['hace 1 minuto', 'en 1 minuto'],
        ['hace %s minutos', 'en %s minutos'],
        ['hace 1 hora', 'en 1 hora'],
        ['hace %s horas', 'en %s horas'],
        ['hace 1 día', 'en 1 día'],
        ['hace %s días', 'en %s días'],
        ['hace 1 semana', 'en 1 semana'],
        ['hace %s semanas', 'en %s semanas'],
        ['hace 1 mes', 'en 1 mes'],
        ['hace %s meses', 'en %s meses'],
        ['hace 1 año', 'en 1 año'],
        ['hace %s años', 'en %s años']
        ][index];
    };
    register('spanish', localeFunc);

    return (
        <div className={classes.mostrarFlex}>
        <Paper elevation={5}>
            <Grid className={classes.padding} container direction="row" justify="flex-start" alignItems="center">
                <Grid item xs={12}>
                    <Typography variant="h4" component="h2" align="left">
                        Reseñas
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h5" component="h2" align="center" align="left">
                        {
                            opiniones.length!==0 &&
                            <><Estrellas clickeable={false} valor={promedioEstrellas}/> {`Puntuación promedio de ${promedioEstrellas} en base a ${opiniones.length} reseñas hechas por otros usuarios.`}</>
                        }
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    {
                        opiniones.length===0 && <Alerta className={classes.inputAncho} style={{marginBottom:"10px"}} variant="outlined" severity="info">
                        {"Esta publicación aún no tiene reseñas"}
                      </Alerta>
                    }
                    {
                        opiniones.map((opinion, i)=>(
                            <Resena opinion={opinion} key={i}/>
                        ))
                    }
                </Grid>
            </Grid>
        </Paper>
        </div>
    );
}

//Subcomponente que muestra cada reseña
function Resena({opinion}) {
    const classes = Estilos();
    return (
        <Paper variant="outlined" square>
            <Grid className={classes.padding} container direction="row" justify="space-around" alignItems="baseline">
                <Grid item xs={6}>
                    <Typography variant="h5" component="h2" align="left">
                        {opinion.titulo}
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Estrellas clickeable={false} valor={opinion.recomendacion}/>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="body1" component="p" align="justify"> 
                        {opinion.descripcion}
                    </Typography> 
                </Grid>
                {/*
                    true && <Grid item xs={4} align="left">
                        <Tooltip title="Me sirve">
                            <Button startIcon={<Like/>}>
                                {opinion.votos_positivos}
                            </Button>
                        </Tooltip>
                        <Tooltip title="No me sirve">
                            <Button color="secondary" startIcon={<Dislike/>}>
                                {opinion.votos_negativos}
                            </Button>
                        </Tooltip>
                    </Grid>
                */}
                
                    {
                        opinion.servicios.map((servicio, i)=>(
                            <Grid key={i} item xs={2} align="center">
                                <Chip variant="outlined" label={servicio.nombre}/>
                            </Grid>
                        ))
                    }
                    
                <Grid item xs={2} align="right">
                    {format(new Date(opinion.created_at),"spanish")}
                </Grid>
            </Grid>
        </Paper>
    );
  }