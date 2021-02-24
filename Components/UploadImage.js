import React, { useEffect, useContext, useState } from "react";
import "react-dropzone-uploader/dist/styles.css";
import Dropzone from "react-dropzone-uploader";
import axios from "axios";

import {UserState} from '../States/User'
//Componente utilizado para la carga de imágenes en el sitio
const SingleFileAutoSubmit = ({ setFiles, images, amount }) => {
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
    console.log(file);
    return file;
  }

  useEffect(async () => {
    console.log(images);
    let files = await Promise.all(
      images.map(async (image) => {
        return await convertToFile(image);
      })
    );
    setInitialFiles(files);
  }, [images]);

  //Se ejecuta cada vez que cambia el estado del componente
  const handleChangeStatus = ({ meta, file }, status) => {
    //Si se remueve una imagen, se la quita del arreglo de imágenes a subir o se la agrega al arreglo de imágenes a borrar, según se necesite
    if (status === "removed") {
      let deletedSome = initialFiles.some((fileLoaded) => fileLoaded === file);
      if (deletedSome) {
        axios
          .delete(API + "/upload/files/" + Number(file.name), {
            headers: {
              Authorization: `Bearer ${UState.jwt}`,
            },
          })
          .then((response) => {
            console.log(response.data)
          })
          .catch((error) => {
            console.log("Error al borrar las imagenes");
            console.log(error.response);
          });
      }
    }
    if (status === "uploading") {
      //setcargando(true)
    }
    if (status === "done") {
      //setcargando(false)
      setFiles(file);
    }
  };

  return (
    <React.Fragment>
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
        inputContent={`Selecciona ${amount} imagenes`}
        styles={{
          dropzone: { width: "100%", height: "100%", overflow: "auto" },
          dropzoneActive: { borderColor: "green" },
        }}
      />
    </React.Fragment>
  );
};

export default SingleFileAutoSubmit;
