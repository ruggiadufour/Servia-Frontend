import React, { useEffect, useState } from "react";
//Material-UI
import {
  Hidden,
  Grid,
  Typography,
  Avatar,
  Divider,
  Button,
  ListItem,
  ListItemText,
  Tooltip,
  Collapse,
  List,
  ListSubheader,
  IconButton,
} from "@material-ui/core";
import {
  Phone as PhoneIcon,
  FileCopy as Copiar,
  ExpandLess,
  ExpandMore,
  CheckCircleOutline as Verificado,
} from "@material-ui/icons/";

import { getUser } from "../../Api/users";

//Subcomponente que contiene la información del perfil de un proveedor
export default function ProfileOwner({ profile }) {
  const API = process.env.NEXT_PUBLIC_API;
  const [extraData, setExtraData] = useState(null);

  useEffect(async () => {
    let data = await getUser(profile.id);
    console.log(data);
    setExtraData({
      categories: data.categories,
      publications: data.publications,
    });
  }, []);

  function copiarAlPortapapeles(telefono) {
    // Crea un campo de texto "oculto"
    var aux = document.createElement("input");
    // Asigna el contenido del elemento especificado al valor del campo
    aux.setAttribute("value", telefono);
    // Añade el campo a la página
    document.body.appendChild(aux);
    // Selecciona el contenido del campo
    aux.select();
    // Copia el texto seleccionado
    document.execCommand("copy");
    // Elimina el campo de la página
    document.body.removeChild(aux);
    setcopiado(true);
  }

  return (
    <div className="p-15 sticky">
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <Grid item xs={12}>
          <Avatar
            alt="Perfil"
            src={profile.profile ? API + profile.profile.url : "/IconoV3.png"}
            className="circle-image "
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h5" component="h2" align="center">
            {`${profile.name} ${profile.surname}`}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Divider />
          <Typography variant="body1" component="p" align="justify">
            {profile.description}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Divider />
          <List
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
              <Typography component="h3" variant="h6" id="nested-list-subheader">
                Ofrece servicios de
              </Typography>
            }
          >
            <Divider />
            {extraData &&
              extraData.categories.map((category, i) => (
                <Categories key={i} category={category} />
              ))}
            <Divider />
          </List>
        </Grid>

        <Hidden xlDown={!profile.show_phone}>
          {profile.phone.length !== 0 && (
            <Grid item xs={12}>
              <a href={"tel:" + profile.phone}>
                <Button startIcon={<PhoneIcon />}>{profile.phone}</Button>
              </a>
              <Tooltip title="Copiar">
                <IconButton onClick={() => copiarAlPortapapeles(profile.phone)}>
                  <Copiar />
                </IconButton>
              </Tooltip>
            </Grid>
          )}
        </Hidden>
      </Grid>
      <style jsx>
        {`
            .sticky{
             
            }
        `}
      </style>
    </div>
  );
}

//Subcomponente que muestra los datos de la categoría y servicios que ofrece el proveedor
function Categories({ category }) {
  const [open, setOpen] = useState(true);

  const handleClick = () => {
    setOpen(!open);
  };
  return (
    <div>
      <ListItem button onClick={handleClick}>
        <ListItemText primary={category.name} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <Divider />
           Hola
          <Divider />
        </List>
      </Collapse>
    </div>
  );
}
