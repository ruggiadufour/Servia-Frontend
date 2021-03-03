import { useState } from "react";
//Material-UI
import {
  Hidden,
  Typography,
  Chip,
  Button,
  Tooltip,
  IconButton,
} from "@material-ui/core/";
import Verificado from "@material-ui/icons/CheckCircleOutline";

//Componentes
import Estrellas from "../Estrellas.js";
import Report from '../Publication/Report'

export default function RowProfile({ profile }) {
  function getImage() {
    let image = profile?.profile?.url
      ? process.env.NEXT_PUBLIC_API + profile.profile.url
      : "/IconoV2.png";
    return image;
  }
  return (
    <div className="card-row background-2">
      <div className="card-img">
        <img src={getImage()} alt="1° imagen" className="image" />
      </div>

      <div className="card-info">
        <Typography align="left" component="h5" variant="h5">
          {`‍${profile.name} ${profile.surname}`}
          <Hidden xlDown={true}>
            <Tooltip title="Usuario verificado">
              <IconButton style={{ padding: 1 }}>
                <Verificado color="inherit" />
              </IconButton>
            </Tooltip>
          </Hidden>
        </Typography>

        <Report id={profile.id} type={true}/>

        {profile.show_phone && profile.phone.length !== 0 && (
          <Typography align="left" component="h5" variant="h5">
            {`📲 ${profile.phone}`}
          </Typography>
        )}
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
          <Typography>{profile.description}</Typography>
        </div>

        <Typography color="secondary" align="left">
          Servicios:{" "}
        </Typography>

        {profile.categories.map((cat, i) => (
          <Chip variant="outlined" label={"✔ "+cat.name} key={i} />
        ))}

        <Estrellas valor={4} clickeable={false} cambiarValor={() => {}} />
      </div>

      <style jsx>
        {`
          .card-img {
            flex: 1;
            min-width: 160px;
            display: flex;
            align-items: center;
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
            position: relative;
          }
          .card-row {
            max-width: 500px;
            height: 100%;
            display: flex;
            flex-wrap: wrap;
          }
        `}
      </style>
    </div>
  );
}
