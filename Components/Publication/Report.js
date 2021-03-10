import React, { useState, useContext } from "react";
import axios from "axios";

//Material UI
import {
  LinearProgress,
  Tooltip,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Modal,
  Backdrop,
  Fade,
  Typography,
  TextField,
  Button,
  Hidden,
} from "@material-ui/core/";
import Report from "@material-ui/icons/PriorityHigh";

import { useMotives, sendReport } from "../../Api/reports";
import { UserState } from "../../States/User";
import { AlertState } from "../../States/Alert";
import { useRouter } from "next/router";

//Subcomponente utilizado cada vez que se quiere reportar una publicación o un perfil
export default function ReportarPublicacion({ type, id }) {
  //type=true means the report goes to a user profile
  const { UState } = useContext(UserState);
  const { ADispatch } = useContext(AlertState);
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [selectedMotives, setSelectedMotives] = useState([]);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(false);

  const { motives, isError } = useMotives(true);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedMotives([]);
    setDescription("")
    setOpen(false);
  };

  //Función ejecutada cada vez que se selecciona un motivo
  function selectMotive(Motive) {
    if (message === true) setMessage(false);

    let is = selectedMotives.some((motive) => motive === Motive.id);
    //Si no está, se lo agrega al arreglo, caso contrario se lo quita
    if (!is) {
      setSelectedMotives((array) => [...array, Motive.id]);
    } else {
      setSelectedMotives(
        selectedMotives.filter((element) => element !== Motive.id)
      );
    }
  }

  async function send() {
    if (selectedMotives.length === 0) {
      setMessage(true);
    } else {
      if (UState) {
        setLoading(true)
        await sendReport(
          id,
          type,
          { description, motives: selectedMotives },
          UState.jwt
        );
        setLoading(false)
        ADispatch({
          type: "setAlert",
          payload: {
            desc: "¡Su reporte se ha enviado satisfactoriamente!",
            type: "success",
            open: true,
          },
        });

        handleClose()
      } else {
        router.push("/sesion");
      }
    }
  }

  if (isError) {
    return <p>Hubo un error, intente luego.</p>;
  }

  return (
    <div className="report">
      <Tooltip title={"Reportar publicación"} >
        <Button onClick={handleOpen}>
          <Report />
        </Button>
      </Tooltip>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition={true}
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        className="flex-col"
      >
        <Fade in={open}>
          <div className="general-width p-15 background-1">
            <Typography variant="h4" component="h2" align="center">
              {`Reportar ${type?"perfil":"publicación"}`}
            </Typography>
            <Typography variant="h5" component="h3" align="left">
              Seleccione los motivos:
            </Typography>
            <FormGroup required>
              {motives?.map((motive, i) => (
                <FormControlLabel
                  key={i}
                  control={
                    <Checkbox
                      variant="error"
                      onChange={() => {
                        selectMotive(motive);
                      }}
                    />
                  }
                  label={motive.name}
                />
              ))}
            </FormGroup>

            <Hidden xlDown={!message || loading}>
              <Typography color="error">Debe seleccionar un motivo.</Typography>
            </Hidden>

            <TextField
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              value={description}
              id="filled-basic"
              label="Informacion adicional"
              variant="filled"
              className="w-100"
              multiline
            />

            <br />
            {loading && <LinearProgress color="secondary" />}

            <Button
              disabled={loading}
              size="large"
              variant="contained"
              color="primary"
              className="w-100"
              onClick={send}
            >
              Enviar
            </Button>
          </div>
        </Fade>
      </Modal>

      <style jsx>
        {`
          .report {
            position: absolute;
            bottom:0;
            right:0;
          }
        `}
      </style>
    </div>
  );
}
