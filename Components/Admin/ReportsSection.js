import { useEffect, useState, useContext } from "react";
import axios from "axios";

//Material-UI
import {
  LinearProgress,
  Paper,
  List,
  ListItem,
  Collapse,
  ListItemText,
  Grid,
  Typography,
  Button,
  Tooltip,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import Ojo from "@material-ui/icons/Visibility";
import Flechita from "@material-ui/icons/ArrowForwardIos";
import Aceptar from "@material-ui/icons/Check";
import Rechazar from "@material-ui/icons/Clear";
import Alerta from "@material-ui/lab/Alert";

import { updateReport } from "../../Api/reports";
import { UserState } from "../../States/User";

export default function ReportSection({
  type,
  reports,
  updateReport,
}) {
  const [title, setTitle] = useState("");

  useEffect(() => {
    //Dependiendo de si accedemos a los reclamos en espera, al historial de reclamos o a los reclamos nuevos, se muestra el título correspodiente
    if (type === 0) setTitle("Reportes pendientes de moderación");
    else if (type === 1) setTitle("Reportes en espera");
    else setTitle("Historial de reportes");
  }, []);

  return (
    <Grid container justify="center">
      <Grid item xs={12}>
        <Typography variant="h4" component="h1" align="center">
          {title}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <br />
        {reports.length === 0 && (
          <Alerta variant="outlined" severity="info">
            No hay reportes para mostrar.
          </Alerta>
        )}
        {reports.map((report, i) => (
          <Report key={i} report={report} updateReport={updateReport} />
        ))}
      </Grid>
    </Grid>
  );
}

function Report({ report, updateReport }) {
  let color;
  //Cada reporte tiene un color asignado según el estado en el que se encuentra.
  switch (report.state) {
    case -1:
      color = "#5d9b9b";
      break;
    case 0:
      color = "gray";
      break;
    case 1:
      color = "yellow";
      break;
    case 2:
      color = "#FFDED3";
      break;
    case 3:
      color = "#D6FFD3";
      break;
  }
  return (
    <Paper variant="outlined" square className="p-15" style={{backgroundColor:color}}>
      <Grid container direction="row" justify="center">
        <Grid item xs={12} lg={9} md={9} sm={12}>
          <Typography
            color="secondary"
            variant="h5"
            component="h2"
            align="left"
          >
            {report.publication === null
              ? `Usuario: ${report.public_user.name} ${report.public_user.surname}`
              : `Publicación: ${report.publication.title}`}
          </Typography>

          {report.publication !== null && (
            <Tooltip title="Vista previa">
              <Button>
                <Ojo color="primary" />
              </Button>
            </Tooltip>
          )}
        </Grid>

        <Grid item xs={12} lg={3} md={3} sm={12}>
          <Typography variant="h6" component="h5" align="right">
            {report.created_at.split("T")[0]}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" component="h5" align="left">
            Motivos del reporte:
          </Typography>
        </Grid>

        <div className="flex-row">
          {report.motives.map((motive, i) => (
            <span key={i} className="rounded-span background-primary-1">
              {motive.name}
            </span>
          ))}
        </div>

        <Grid item xs={12}>
          {<DeployData report={report} updateReport={updateReport} />}
        </Grid>
      </Grid>
    </Paper>
  );
}

function DeployData({ report, updateReport }) {
  const { UState, socket } = useContext(UserState);
  //States
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  /*
   * state:-1 ->Report answered by the publication/profile owner
   * state: 0 ->Report waiting to be managed
   * state: 1 ->Report waiting the user owner update the publication/profile
   * state: 2 ->Rejected report
   * state: 3 ->Concluided report
   */

  function updateR(desc, isAccepted) {
    //updateReport(id, isAccepted, action, desc, UState.jwt)
    const type = report.publication===null?true:false;
    const title = report.publication!==null?report.publication.title:"";
    const idP_P = report.publication===null?report.public_user.id:report.publication.id;

    socket.emit("reports", JSON.stringify({id:report.id, idP_P, title, type, isAccepted, action, desc, jwt: UState.jwt}));
  } 

  return (
    <div>
      <ListItem button onClick={handleClick}>
        <ListItemText primary="Desplegar información" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <Typography>{`Descripción: ${report.description}`}</Typography>
          <hr />

          {report.state <= 0 && (
            <FormControl component="fieldset" align="left">
              <FormLabel required component="legend">
                Acción
              </FormLabel>
              <RadioGroup
                disabled={report.state > 0}
                row
                aria-label="Accion"
                value={action}
                onChange={(e) => {
                  setAction(!action);
                }}
              >
                <FormControlLabel
                  value="true"
                  checked={action}
                  control={<Radio />}
                  label={
                    report.state === 0
                      ? report.publication !== null
                        ? "Continuar con la publicación bloqueada"
                        : "Continuar con el perfil bloqueado"
                      : report.publication !== null
                      ? "Bloquear publicación"
                      : "Bloquear perfil"
                  }
                />
                <FormControlLabel
                  value="false"
                  checked={!action}
                  control={<Radio />}
                  label={
                    report.state === -1
                      ? report.publication !== null
                        ? "Desbloquear publicación"
                        : "Desbloquear perfil"
                      : "No hacer nada"
                  }
                />
              </RadioGroup>
            </FormControl>
          )}

          {report.state > 0 && (
            <Typography variant="h6" component="h5" align="left">
              {report.blocked
                ? report.publication !== null
                  ? "La publicación fue bloqueada"
                  : "El perfil fue bloqueado"
                : report.publication !== null
                ? "No se bloqueó la publicación"
                : "No se bloqueó el perfil"}
            </Typography>
          )}

          <div hidden={report.state > 0}>
            {/* {publication.state === -1 && (
              <ParteEspera_Historial datos={datos.notificacion} />
            )} */}

            <NewReports
              updateR={updateR}
              report={report}
              isResponse={report.state === -1}
            />
          </div>

          {/* <div hidden={datos.estado <= 0}>
            <ParteEspera_Historial datos={datos.notificacion} />
          </div> */}
        </List>
      </Collapse>
    </div>
  );
}

//Componente que se utiliza para mostrar los reportes de la sección "Gestionar nuevos reportes"
const NewReports = ({ updateR, report, isResponse }) => {
  const [description, setDescription] = useState("");
  return (
    <div>
      <Grid item xs={12}>
        <TextField
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          value={description}
          id="outlined-basic"
          label="Agregar mensaje"
          multiline
          variant="outlined"
          size="medium"
          fullWidth
        />
      </Grid>

      <div align="center">
        <Button
          startIcon={<Aceptar />}
          onClick={() => {
            updateR(description, true);
          }}
        >
          {isResponse ? "Confirmar acción" : "Aceptar reporte"}
        </Button>
        {report.state !== -1 && (
          <Button
            color="secondary"
            startIcon={<Rechazar />}
            onClick={() => {
              updateR(description, false);
            }}
          >
            Descartar reporte
          </Button>
        )}
      </div>
    </div>
  );
};

//Componente que se utiliza para mostrar los reportes de la sección "Reportes en espera"
const ParteEspera_Historial = ({ datos }) => {
  return datos.map((notif, i) => (
    <div key={i}>
      <hr />
      <Grid container justify="center">
        <Grid item xs={9}>
          <Typography
            color="secondary"
            variant="h5"
            component="h4"
            align="left"
          >
            Mensaje del administrador
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="h6" component="h5" align="right">
            {notif.created_at.split("T")[0]}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          {notif.datos_notificacion}
        </Grid>
      </Grid>
    </div>
  ));
};
