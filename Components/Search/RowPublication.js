import { useState } from "react";
//Material-UI
import {
  Hidden,
  Typography,
  Chip,
  Button,
  Grid,
  Tooltip,
  IconButton,
} from "@material-ui/core/";
import Editar from "@material-ui/icons/Edit";
import Pausa from "@material-ui/icons/Pause";
import Despausar from "@material-ui/icons/PlayArrow";
import Eliminar from "@material-ui/icons/DeleteForever";
import Alerta from "@material-ui/lab/Alert";
import Verificado from "@material-ui/icons/CheckCircleOutline";

//Componentes
import Estrellas from "../Estrellas.js";

export default function RowPublication({ publication }) {
  //Variables para el manejo del componente
  const [precioPresupuesto, setPrecioPresupuesto] = useState("");
  const [noMostrar, setnoMostrar] = useState(true);

  const [datosPagina, setdatosPagina] = useState({
    id: null,
    titulo: "",
    descripcion: "",
    precio_estimado: 0,
    imagenes: [],
    servicio: "",
    estrellas: 0,
    tipo: false,
    Usuario_id: { id: null, nombre: "", apellido: "", imagen_perfil: null },
    Servicio_id: { nombre: "" },
    pausado: false,
    bloqueado: false,
  });


  return (
    <div className="card-row background-2">
      <div className="card-img">
        <img
          src={process.env.NEXT_PUBLIC_API + publication.images[0].url}
          alt="1° imagen"
          className="image"
        />
      </div>

      <div className="card-info">
        

        <Typography align="left" component="h5" variant="h4">
          {publication.title}
        </Typography>
        <Typography align="left" component="h5" variant="h5">
          {`${publication.public_user.name} ${publication.public_user.surname}`}
        </Typography>
        <div
          style={{
            overflow: "auto",
            textOverflow: "ellipsis",
            textJustify: "auto",
            align: "left",
            WebkitLineClamp: "3",
            height: "3",
          }}
        >
          <Typography>{publication.description}</Typography>
        </div>

        <Typography component="h6" variant="h6">
          Presupuesto estimado: ${publication.price}
        </Typography>

        <Chip variant="outlined" label={publication.service.name} />

        <Estrellas valor={4} clickeable={false} cambiarValor={() => {}} />

        <a href="#">
          <Button variant="contained" color="primary">
            Leer más
          </Button>
        </a>
      </div>

      <style jsx>
        {`
          .card-img {
            flex: 1;
            min-width: 160px;
          }
          .image {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .card-info {
            flex: 2;
            padding: 10px;
            text-align: center;
            min-width: 280px;
          }
          .card-row {
            max-width: 500px;
            display: flex;
            flex-wrap: wrap;
          }
        `}
      </style>
    </div>
  );
}
