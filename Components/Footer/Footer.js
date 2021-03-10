import React, { useState } from "react";
import Link from "next/link";

//Material-UI
import { Instagram, Facebook } from "@material-ui/icons/";
import { Typography, Grid, AppBar, Toolbar } from "@material-ui/core/";
import Alert from "../../Components/Alert";
import Contact from "./Contact";

//Componente que se muestra en la sección más baja de todas las vistas, es decir, el footer
export default function Footer() {
  const [contactUs, setContactUs] = useState(false);

  return (
    <>
      <Alert />
      <div className="background-primary-1 p-15">
        <Grid container direction="row" alignItems="center" justify="center">
          <Grid item xs={12} sm={4} align="center">
            {/*<Link className={classes.EstiloLink} to="/sobre-nosotros">Sobre nosotros</Link><br/>*/}
            <Typography component="h3" variant="h5" className="text-same-ever" align="center">
              <Link href={"/preguntas-frecuentes"}>
                Preguntas frecuentes 🙋‍♀️
              </Link>
            </Typography>
          </Grid>

          <Grid item xs={12} sm={4} align="center">
            <Contact />
          </Grid>

          <Grid item xs={12} sm={4} align="center">
            <Typography component="h3" variant="h5" align="center" className="text-same-ever">
              Nuestras redes 📺
            </Typography>
            <a href="https://www.facebook.com/RuggiaAngel" target="_blank">
              <Facebook fontSize="large" />
            </a>
            <a
              href="https://www.instagram.com/ferransolischorvat/"
              target="_blank"
            >
              <Instagram fontSize="large" />
            </a>
          </Grid>
        </Grid>
      </div>
    </>
  );
}
