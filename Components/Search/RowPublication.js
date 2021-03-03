import { useState, useContext } from "react";
import { useRouter } from "next/router";
import { UserState } from "../../States/User";
//Material-UI
import {
  Hidden,
  Typography,
  Chip,
  Button,
  Grid,
  Tooltip,
  IconButton,
  useControlled,
} from "@material-ui/core/";
import Edit from "@material-ui/icons/Edit";
import Paused from "@material-ui/icons/Pause";
import Unpaused from "@material-ui/icons/PlayArrow";
import Delete from "@material-ui/icons/DeleteForever";
import Verified from "@material-ui/icons/CheckCircleOutline";

//Components
import Stars from "../Estrellas";
import AlertDialog from "../YesNoDialog";
import Report from "../Publication/Report";

//API client
import { modifyPublication, deletePublication } from "../../Api/publications";
export default function RowPublication({ publication, removeOne }) {
  const { UState } = useContext(UserState);
  const router = useRouter();

  const [thisPublicaction, setThisPublication] = useState(publication);
  const [openDialog, setOpenDialog] = useState(false);

  function seeMore() {
    router.push(`/publicaciones/${publication.id}`);
  }

  async function pause() {
    const { data } = await modifyPublication(
      thisPublicaction.id,
      { paused: !thisPublicaction.paused },
      [],
      UState.jwt
    );
    if (data) setThisPublication(data);
  }

  async function deleteThis(isTrue) {
    setOpenDialog(false);
    if (isTrue) {
      const { data } = await deletePublication(thisPublicaction.id, UState.jwt);
      if (data) removeOne(thisPublicaction.id);
    }
  }

  function getImage() {
    let image =
      thisPublicaction.images.length !== 0
        ? process.env.NEXT_PUBLIC_API + thisPublicaction.images[0].url
        : "/IconoV2.png";
    return image;
  }

  return (
    <div className="card-row background-2">
      <div className="card-img">
        <img src={getImage()} alt="1° imagen" className="image" />
        <div
          className="manage-publication"
          hidden={
            !(thisPublicaction.public_user.id === UState?.user.public_user.id)
          }
        >
          <Tooltip title="Editar publicación">
            <IconButton
              onClick={() => {
                router.push(
                  `/${
                    thisPublicaction.type
                      ? "publicaciones/modificar"
                      : "solicitudes/modificar"
                  }/${thisPublicaction.id}`
                );
              }}
            >
              <Edit color="primary" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Pausar publicación">
            <IconButton onClick={pause}>
              {thisPublicaction.paused ? (
                <Unpaused color="secondary" />
              ) : (
                <Paused color="primary" />
              )}
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar publicación">
            <IconButton
              onClick={() => {
                setOpenDialog(true);
              }}
            >
              <Delete color="error" />
            </IconButton>
          </Tooltip>
        </div>
      </div>

      <div className="card-info">
        <Report id={thisPublicaction.id} type={false} />

        <Typography align="left" component="h5" variant="h4">
          {thisPublicaction.title}
        </Typography>
        <Typography align="left" component="h5" variant="h5">
          {`${thisPublicaction.public_user.name} ${thisPublicaction.public_user.surname}`}
          <Hidden xlDown={!thisPublicaction.public_user.verified}>
            <Tooltip title="Usuario verificado">
              <IconButton>
                <Verified color="inherit" />
              </IconButton>
            </Tooltip>
          </Hidden>
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
          <Typography>{thisPublicaction.description}</Typography>
        </div>

        {thisPublicaction.price !== 0 && (
          <Typography component="h6" variant="h6">
            {`${thisPublicaction.type ? "Precio" : "Presupuesto"} estimado: ${
              thisPublicaction.price
            }`}
          </Typography>
        )}

        {/* <Chip variant="outlined" label={publication.service.name} /> */}

        <Stars valor={4} clickeable={false} cambiarValor={() => {}} />

        <Button variant="contained" color="primary" onClick={seeMore}>
          Leer más
        </Button>

        {openDialog && (
          <AlertDialog
            title={`¿Realmente quiere eliminar ${publication.title}?`}
            message="La publicación se eliminará permanentemente."
            callback={deleteThis}
          />
        )}
      </div>

      <style jsx>
        {`
          .card-img {
            flex: 1;
            min-width: 160px;
            position: relative;
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
            display: flex;
            flex-wrap: wrap;
          }
          .manage-publication {
            position: absolute;
            top: 0;
            left: 0;
          }
        `}
      </style>
    </div>
  );
}
