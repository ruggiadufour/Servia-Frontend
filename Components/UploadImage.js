import React,{useEffect, useContext, useState} from 'react';
import 'react-dropzone-uploader/dist/styles.css'
import Dropzone from 'react-dropzone-uploader'
import axios from 'axios'

//Componente utilizado para la carga de imágenes en el sitio
const SingleFileAutoSubmit = ({cantidad, funcionSetImagen, ids, setcargando}) => {
  //Constante del componente 
  const toast = (innerHTML) => {
      const el = document.getElementById('toast')
      el.innerHTML = innerHTML
      el.className = 'show'
      setTimeout(() => { el.className = el.className.replace('show', '') }, 3000)
    }

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
          //onChangeStatus={handleChangeStatus}
          maxFiles={cantidad}
          //initialFiles={}
          multiple={true}
          maxSizeBytes={5000000}
          canCancel={false}
          accept="image/*"
          inputWithFilesContent={'Subir otra imagen'}
          inputContent={`Selecciona 1 imagen`}
          styles={{
            dropzone: { width: "100%", height: "100%", overflow:"auto"},
            dropzoneActive: { borderColor: 'green' },
          }}
        />
      </React.Fragment>
    )
  }

  export default SingleFileAutoSubmit;