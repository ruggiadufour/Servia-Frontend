import React from 'react';
import Rating from '@material-ui/lab/Rating';

import Estilos from './Estilos.js'

//Subcomponente de las puntuación en forma de estrellas
export default function Puntuacion({valor, clickeable, cambiarValor}) {
    const classes = Estilos();
    
    return (
        <div className={classes.mostrarFlex}>
            <Rating name="half-rating" onChange={cambiarValor} readOnly={!clickeable} value={valor} precision={0.5} />
        </div>
    );
}