import { useEffect, useState, useContext } from "react";
import axios from "axios";

import {
  CircularProgress,
  Typography,
  TextField,
  Button,
} from "@material-ui/core/";

import {AlertState} from '../../States/Alert'
export default function Contact() {
  const API = process.env.NEXT_PUBLIC_API
  const {ADispatch} = useContext(AlertState)

  //State variables
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  function send(e) {
    e.preventDefault();
    setLoading(true);
    axios
      .post(
        API+"/contact",
        { name, message, email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        setEmail("");
        setMessage("");
        setName("");
        setLoading(false);

        ADispatch({
          type: "setAlert",
          payload: {
            desc: "¡Su mensaje ha sido enviado satisfactoriamente!",
            type: "success",
            open: true,
          },
        });
      })
      .catch((error) => {
        setLoading(false);
        ADispatch({
          type: "setAlert",
          payload: {
            desc: "Algo ocurrió y su mensaje no ha podido ser enviado, vuelva a intentar luego.",
            type: "error",
            open: true,
          },
        });
      });
  }

  return (
    <>
      <form onSubmit={send}>
        <Typography component="h3" variant="h4" align="center"  className="text-same-ever">
          Contactanos
        </Typography>
        <TextField
          name="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          label="👨‍🦰 Tu nombre"
          variant="filled"
          type="text"
          required
          helperText={false}
          className="w-100 background-1 text-same-ever"
        />

        <TextField
          name="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          label="📧 Tu correo electrónico (opcional)"
          variant="filled"
          type="email"
          className="w-100 background-1 text-same-ever"
        />
        <TextField
          name="message"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          label="💬 Tu mensaje"
          variant="filled"
          type="text"
          required
          helperText={false}
          className="w-100 background-1 text-same-ever"
        />

        {loading && (
          <div className="w-100 centering">
            <CircularProgress color="secondary"/>
          </div>
        )}

        <div className="m-5">
          <Button
            disabled={loading}
            size="large"
            variant="contained"
            color="secondary"
            type="submit"
          >
            Enviar
          </Button>
        </div>
        <div>
          <p className="text-same-ever">
            O simplemente envianos un correo a:
            <a href="mailto:angelruggia@gmail.com">
              <strong>{` angelruggia@gmail.com / `}</strong>
            </a>
            <a href="mailto:ferransolischorvat@gmail.com">
              <strong>ferransolischorvat@gmail.com</strong>
            </a>
          </p>
        </div>
      </form>
      <style jsx>{`
        p {
          margin-bottom: 15px;
        }
        form {
          max-width: 400px;
          margin: auto;
          margin-top: 40px;
        }
        .m-5 {
          margin: 5px;
        }
        h2 {
          font-size: 1.3rem;
        }
      `}</style>
    </>
  );
}
