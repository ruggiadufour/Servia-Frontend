import React from 'react';
import {Typography, Paper} from '@material-ui/core/';

import Estilos from '../Estilos';

export default function SobreNosotros() {
  const classes = Estilos();
  return (
    <div className={classes.fondo} >
      <Paper elevation={3} style={{width:650, minHeight:300, padding: 15}}>    
        <Typography component="h3" variant="h4" align="center">
            ¿Quienes somos?
        </Typography>  
        <Typography variant="body1" align="left">
            Somos...
        </Typography>
      </Paper>
    </div>
  );
}