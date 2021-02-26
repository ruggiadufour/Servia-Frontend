import React, { useState, useContext, useEffect } from "react";
import Link from "next/link";

import { UserState } from '../States/User'
import { getLoggedUser } from '../Api/logged_user'
//Material-UI
import { Instagram, Facebook } from "@material-ui/icons/";
import { Typography, Grid, AppBar, Toolbar } from "@material-ui/core/";
import Alert from '../Components/Alert'
import {setCookie} from 'nookies'
//Componente que se muestra en la sección más baja de todas las vistas, es decir, el footer
export default function Footer() {
  const { UState, UDispatch} = useContext(UserState)
  const [contactanos, setcontactanos] = useState(false);

  useEffect(async()=>{ 
    if(UState?.jwt){
      let user = await getLoggedUser(UState.jwt, UState.user.id)
      UDispatch({type: "setUser", payload: {jwt: UState.jwt, user: user}})

      setCookie(
        null,
        "session",
        JSON.stringify({ user: user, jwt: UState.jwt }),
        {
          maxAge: 30 * 24 * 60 * 60,
          path: "/",
        }
      );
    }
  },[])

  return (
    <>
      <Alert/>
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
