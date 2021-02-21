import React, { useState } from "react";
import Link from "next/link";
import { Instagram, Facebook } from "@material-ui/icons/";

//Material-UI
import { Typography, Grid, AppBar, Toolbar } from "@material-ui/core/";

//Componente que se muestra en la sección más baja de todas las vistas, es decir, el footer
export default function Footer() {
  const [contactanos, setcontactanos] = useState(false);

  return (
    <>
      <AppBar position="relative" color="secondary">
        <Toolbar>
          <Grid container direction="row" alignItems="center" justify="center">
            <Grid item xs={12} sm={4} align="center">
              {/*<Link className={classes.EstiloLink} to="/sobre-nosotros">Sobre nosotros</Link><br/>*/}
              <Link href={"/preguntas-frecuentes"}>Preguntas frecuentes</Link>
            </Grid>
            <Grid item xs={12} sm={4} align="center">
              {/*<Link className={classes.EstiloLink} to="/terminos-de-uso">Términos de uso</Link><br/>*/}
              <a
                href="#"
                onClick={() => {
                  setcontactanos(!contactanos);
                }}
              >
                Contáctanos
              </a>
              {contactanos && (
                <div>
                  <a href="mailto:angelruggia@gmail.com">
                    angelruggia@gmail.com
                  </a>
                  <br />
                  <a href="mailto:ferransolischorvat@gmail.com">
                    ferransolischorvat@gmail.com
                  </a>
                </div>
              )}
            </Grid>
            <Grid item xs={12} sm={4} align="center">
              <Typography>Nuestras redes</Typography>
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
        </Toolbar>
      </AppBar>
    </>
  );
}
