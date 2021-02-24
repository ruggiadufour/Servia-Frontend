import React, { useState, useEffect, useContext } from "react";
//Material-UI
import {
  Paper,
  Grid,
  Typography,
  Breadcrumbs,
  Avatar,
} from "@material-ui/core/";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";

import ImageGallery from "react-image-gallery";

//Subcomponente que contiene la información de la publicación o parte de la información el perfil de un proveedor
export default function PublicacionInfo({ publication }) {
  return (
  
      <div className="p-15">
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Grid item lg={4} md={4} sm={12}>
            <Typography variant="h6" component="h3" align="left">
              {`Precio estimado: ${publication.price}`}
            </Typography>
          </Grid>

          <Grid item lg={7} md={7} sm={11} align="right">
            <div align="right">
              <Breadcrumbs
                separator={<NavigateNextIcon fontSize="small" />}
                aria-label="breadcrumb"
              >
                <Typography color="inherit">
                  {publication.category.name}
                </Typography>
              </Breadcrumbs>
            </div>
          </Grid>

          <Grid item xs={12} sm={12}>
            <Typography variant="h5" component="h1" align="left">
              {publication.title}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body1" component="p" align="justify">
              {publication.description}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <ImageGallery
              items={
                publication.images.length === 0
                  ? [{ original: "/IconoV4.png", thumbnail: "/IconoV4.png" }]
                  : publication.images.map((image) => ({
                      original: process.env.NEXT_PUBLIC_API + image.url,
                      thumbnail: process.env.NEXT_PUBLIC_API + image.url,
                    }))
              }
            />
          </Grid>
        </Grid>
      </div>
  );
}
