import React, {useState, useEffect} from 'react';
import Chip from '@material-ui/core/Chip';
import {Done as DoneIcon, Clear as ClearIcon} from '@material-ui/icons';

import Estilos from './Estilos.js';

//Componente utilizado para el proceso de selección de servicios de la página por un determinado proveedor
export default function SeleccionarServicio({servicio, agregarSeleccionado}) {
  const classes = Estilos();
  const [hecho_noHecho, setHecho_noHecho] = useState((<div><ClearIcon/></div>));
  const [seleccion, setSeleccion] = useState(servicio.seleccionado);

  //Si el servicio está seleccionado, entonces se cambia el icono al correspondiente, y viceversa
  useEffect(()=>{
    if(servicio.seleccionado===true){
      setSeleccion(true);
      setHecho_noHecho(<div><DoneIcon/></div>);
    }else{
      setSeleccion(false);
      setHecho_noHecho(<div><ClearIcon/></div>);
    }
  },[])

  //Dependiendo si se selecciona o no el servicio, se agrega o quita del arreglo de servicios seleccionados
  const handleClick = () => {
    agregarSeleccionado(!seleccion)
    if(seleccion===false){
      setSeleccion(true);
      setHecho_noHecho(<div><DoneIcon/></div>);
    }else{
      setSeleccion(false);
      setHecho_noHecho(<div><ClearIcon/></div>);
    }
  };

  return (
    <div className={classes.mostrarFlex}>
      <Chip clickable color="primary" label={servicio.nombre} icon={hecho_noHecho} onClick={handleClick}/>
    </div>
  );
}