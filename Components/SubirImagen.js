import React,{useEffect, useContext, useState} from 'react';
import 'react-dropzone-uploader/dist/styles.css'
import Dropzone from 'react-dropzone-uploader'
import axios from 'axios'
import { ObtenerEstadoAplicacion } from '../Estados/AplicacionEstado'

//Componente utilizado para la carga de imágenes en el sitio
const SingleFileAutoSubmit = ({cantidad, funcionSetImagen, ids, setcargando}) => {
  //Constante del componente 
  const toast = (innerHTML) => {
      const el = document.getElementById('toast')
      el.innerHTML = innerHTML
      el.className = 'show'
      setTimeout(() => { el.className = el.className.replace('show', '') }, 3000)
    }
  
  //Variables del componente
  const [archivos, setarchivos] = useState([])
  const [archivosSubidos, setarchivosSubidos] = useState([])
  const { state } = useContext(ObtenerEstadoAplicacion);
  
  //Cada vez que se agreguen nuevas imágenes o se carguen las imágenes guardadas, se ejecuta este método
  useEffect(()=>{
    //Si hay algún id distinto de nulo
    if(state.datosSesion.id!==null && ids.some(id=>(id!==null))){
      let IDS = ""
      //Concatenamos todos los ids para poder realizar la consulta
      ids.map((id)=>{
        if(id!==null){
          IDS+="id_in="+id+"&"
        }
      })
      axios.get(state.servidor+"/upload/files?"+IDS)
      .then(response => {
        response.data.map((dat) => {
          //Creamos los archivos de imágenes
          hacerArchivo(dat)
        })
      })  
      .catch(error => {
          console.log("Error: ", error.response)
      })
    }
  },[ids])
    
    //Método que sirve para transformar las imágenes que maneja el backend a imágenes que utiliza el componente
    function hacerArchivo(imagen) {
      let imagenUrl = state.servidor+imagen.url
      let file
      fetch(imagenUrl).then(res => {
        res.arrayBuffer().then(buf => {
          file = new File([buf], ""+imagen.id, { type: 'image/jpeg' })
          setarchivos([...archivos, file])
          setarchivosSubidos(arch => [...arch, file])
        })
      })
    }

    //Seteamos las imágenes
    const getUploadParams = ({ file, meta }) => {
      funcionSetImagen(file, cantidad, 0, archivosSubidos)
      return { url: 'https://httpbin.org/post'}
    }
    
    //Se ejecuta cada vez que cambia el estado del componente
    const handleChangeStatus = ({ meta, file }, status) => {
      //Si se remueve una imagen, se la quita del arreglo de imágenes a subir o se la agrega al arreglo de imágenes a borrar, según se necesite
      if (status === 'removed') {
        funcionSetImagen(file, cantidad, 1, archivosSubidos);
      }
      if (status === 'uploading'){
        setcargando(true)
      }
      if (status === 'done'){
        setcargando(false)
      }
    }
  
    return (
      <React.Fragment>
        <Dropzone
          getUploadParams={getUploadParams}
          onChangeStatus={handleChangeStatus}
          maxFiles={cantidad}
          initialFiles={ids.length!==0?archivos:null}
          multiple={true}
          maxSizeBytes={5000000}
          canCancel={false}
          accept="image/*"
          inputWithFilesContent={'Subir otra imagen'}
          inputContent={()=>(cantidad===1?`Selecciona ${cantidad} imagen`:`Selecciona hasta ${cantidad} imágenes`)}
          styles={{
            dropzone: { width: "100%", height: "100%", overflow:"auto"},
            dropzoneActive: { borderColor: 'green' },
          }}
        />
      </React.Fragment>
    )
  }

  export default SingleFileAutoSubmit;