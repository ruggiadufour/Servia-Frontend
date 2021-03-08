import { useContext, useEffect, useState } from "react";
//Material-UI
import {
  LinearProgress,
  Collapse,
  Hidden,
  ListItemText,
  ListItem,
  List,
  Paper,
  Grid,
  Typography,
  Button,
  TextField,
} from "@material-ui/core/";
import {
  Clear as Rechazar,
  Check as Aceptar,
  ExpandLess,
  ExpandMore,
} from "@material-ui/icons/";
import { Alert } from "@material-ui/lab";

//Componentes
import "react-lightbox-component/build/css/index.css";
import Images from "react-lightbox-component";

import { useToVerify } from "../../Api/logged_user";
import { UserState } from "../../States/User";
import { AlertState } from "../../States/Alert";


export default function Verification() {
  const { UState } = useContext(UserState);
  //Variables del componente
  const { usersToVerify, isLoading, error } = useToVerify(UState.jwt);

  if (isLoading) {
    return (
      <div className="w-100">
        <LinearProgress />
      </div>
    );
  }
  if (error) {
    return (
      <h1>Ha ocurrido un error, intente mas tarde.</h1>
    );
  }

  //Si el administrador realiza una acción ante una solicitud, entonces esta debe ser sacada de la lista de
  //solicitudes, el siguiente método hace eso.
  function remove(usuario_id) {
    setusuariosVerificar(
      usuariosVerificar.filter((user) => user.id !== usuario_id)
    );
  }
  return (
    <div className="general-width centering-t">
      <Grid container justify="center">
        <Grid item xs={12}>
          <Typography variant="h4" component="h1" align="center">
            Verificar identidades
          </Typography>
        </Grid>

        {usersToVerify.length === 0 && (
          <Grid item xs={12}>
            <Alert variant="outlined" severity="info">
              No hay usuarios que deseen verificar su identidad.
            </Alert>
          </Grid>
        )}

        {usersToVerify.map((user, i) => (
          <Grid item xs={12} key={i}>
            <Request user={user} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

//Este componente hace referencia a una solicitud, como las solicitudes pueden ser muchas, se separa en un componente aparte
function Request({ user }) {
  return (
    <Paper variant="outlined" square className="p-15 w-100">
      <Grid container direction="row" alignItems="center">
        <Grid item xs={12}>
          <Button>
            <Typography variant="h5" component="h5" align="left">
              {`${user.public_user.name} ${user.public_user.surname}`}
            </Typography>
          </Button>
          <Button disabled>
            <Typography variant="h5" component="h2" align="left">
              DNI: {user.dni}
            </Typography>
          </Button>
        </Grid>
        <Grid item xs={12}>
          <DeployData user={user} />
        </Grid>
      </Grid>
    </Paper>
  );
}

//Cada fila de solicitud, muestra una información reducida para no tener que colapsar la vista con información
//para ver toda la información es necesario desplegarla, el siguiente componente permite eso.
function DeployData({ user }) {
  const { socket, UState } = useContext(UserState);
  const { ADispatch } = useContext(AlertState);
  //states
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [description, setDescription] = useState("");

  //Función que se ejecuta cada vez que se acciona el desplegar información (mostrando u ocultando la información)
  const handleClick = () => {
    setOpen(!open);
  };

  //Setting the images
  useEffect(() => {
    if (user.dni_image.photos) {
      let img = user.dni_image.photos.map((image) => ({
        src: process.env.NEXT_PUBLIC_API + image.url,
        title: image.name,
        description: "Imagenes de D.N.I.",
      }));
      setImages(img);
    }
  }, [user]);

  //Emit a socket event on accept o reject
  function response(isAccepted){
    let desc_to_admin = ""
    if(!isAccepted && description===""){
      desc_to_admin = "Tenés que escribir un mensaje de por qué se ha rechazado la solicitud"
    }

    socket.emit("setVerification",JSON.stringify({id: user.id, description, isAccepted, jwt:UState.jwt }))

    ADispatch({
      type: "setAlert",
      payload: {
        desc: desc_to_admin === ""?"La solicitud ha sido respondida.":desc_to_admin,
        type: desc_to_admin === ""?"success":"warning",
        open: true,
      },
    });
  }

  return (
    <div>
      <ListItem button onClick={handleClick}>
        <ListItemText primary="Desplegar información" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <Grid container direction="row" alignItems="center" justify="center">
            <Grid item xs={4} sm={12}>
              <div align="center">
                <Images
                  images={images}
                  thumbnailWidth="100px"
                  thumbnailHeight="100px"
                />
              </div>
            </Grid>

            <Grid item xs={12}>
              <TextField
                id="outlined-basic"
                name="description"
                label="Agregar mensaje"
                multiline
                variant="outlined"
                size="medium"
                fullWidth
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              ></TextField>
            </Grid>

            <div align="center">
              <Button color="secondary" onClick={()=>{response(true)}} startIcon={<Aceptar />}>
                Validar Identidad
              </Button>

              <Button color="error" onClick={()=>{response(false)}} startIcon={<Rechazar />}>
                Rechazar Solicitud
              </Button>
            </div>
          </Grid>
        </List>
      </Collapse>
    </div>
  );
}
