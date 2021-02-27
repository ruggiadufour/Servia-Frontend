import React, { useEffect, useContext, useState } from "react";
import "react-dropzone-uploader/dist/styles.css";
import Dropzone from "react-dropzone-uploader";
import axios from "axios";

import {UserState} from '../States/User'
//Componente utilizado para la carga de imágenes en el sitio
const SingleFileAutoSubmit = ({ setFiles, Files, preloadImages, amount, setToDelete }) => {
  const {UState} = useContext(UserState)

  const API = process.env.NEXT_PUBLIC_API;
  const [initialFiles, setInitialFiles] = useState([]);
  //Constante del componente
  const toast = (innerHTML) => {
    const el = document.getElementById("toast");
    el.innerHTML = innerHTML;
    el.className = "show";
    setTimeout(() => {
      el.className = el.className.replace("show", "");
    }, 3000);
  };

  //Convert url to file
  async function convertToFile(image) {
    let file;
    let fetched = await fetch(API + image.url);
    let buf = await fetched.arrayBuffer();
    file = new File([buf], "" + image.id, { type: "image/jpeg" });
    return file;
  }

  useEffect(async () => {
    let files = await Promise.all(
      preloadImages.map(async (image) => {
        return await convertToFile(image);
      })
    );
    setInitialFiles(files);
  }, [preloadImages]);

  //Se ejecuta cada vez que cambia el estado del componente
  const handleChangeStatus = ({ meta, file }, status) => {
    //Si se remueve una imagen, se la quita del arreglo de imágenes a subir o se la agrega al arreglo de imágenes a borrar, según se necesite
    if (status === "removed") {
      let deletedSome = initialFiles.some((fileLoaded) => fileLoaded === file);
      if (deletedSome) {
        setToDelete(Number(file.name))
      }else{
        setFiles(Files.filter(File => File!==file))
      }
    }
    if (status === "uploading") {
    }
    if (status === "done") {
      let isUploaded = initialFiles.some((fileLoaded) => fileLoaded === file);

      //if is uploaded we dont setFiles, so in modificar we don't save a new file
      if(!isUploaded){
        setFiles([...Files, file]);
      }
    }
  };

  return (
    <>
      <Dropzone
        //getUploadParams={getUploadParams}
        onChangeStatus={handleChangeStatus}
        maxFiles={amount}
        initialFiles={initialFiles}
        multiple={true}
        maxSizeBytes={5000000}
        canCancel={false}
        accept="image/*"
        inputWithFilesContent={"Subir otra imagen"}
        inputContent={amount===1?`Selecciona${amount} imagen`:`Selecciona hasta ${amount} imagenes`}
        styles={{
          dropzone: { width: "100%", height: "100%", overflow: "auto" },
          dropzoneActive: { borderColor: "green" },
        }}
      />
    </>
  );
};

export default SingleFileAutoSubmit;
