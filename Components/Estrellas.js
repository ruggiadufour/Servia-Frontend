import React from 'react';
import Rating from '@material-ui/lab/Rating';


//Subcomponente de las puntuación en forma de estrellas
export default function Puntuacion({valor, clickeable, cambiarValor}) {   
    return (
        <div>
            <Rating name="half-rating" onChange={cambiarValor} readOnly={!clickeable} value={valor} precision={0.5} />
        </div>
    );
}