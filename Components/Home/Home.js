import {  useEffect, useState, useContext } from "react";
import {useRouter} from "next/router";
//Material UI
import {
  Typography,
  Grid,
} from "@material-ui/core/";

import React from 'react'
import {FilterState} from '../../States/Filter'

export default function Home({ categories }) {
  const router = useRouter();
  const {FState, FDispatch} = useContext(FilterState)

  function searchProfiles(id,name){
    let filter = {category:name, category_id: id, is_profile: true, services: [], typePublication: true, word: ""}
    FDispatch({ type: "setFilter", payload: filter });
    router.push("/busqueda")
  }
  return (
    <div className="general-width categories">
      <Typography component="h2" variant="h4" align="left">
        Mirá los perfiles de nuestros profesionales seleccionado la categoría
        del servicio que buscás.
      </Typography>
      <div className="all">
        <Grid container spacing={5} justify="space-around" alignItems="center">
          {categories.map((cat, i) => (
            <Grid item sm={4} md={3} lg={2} key={i} align="center">
              <Typography align="center" variant="body1">
                {cat.name}
              </Typography>

              <img
                src={process.env.NEXT_PUBLIC_API + cat.image.formats.small.url}
                height="150px"
                width="150px"
                onClick={()=>{searchProfiles(cat.id,cat.name)}}
              />
            </Grid>
          ))}
        </Grid>
      </div>

      <style jsx>
        {`
          .all {
            margin-top: 25px;
          }
          img {
            border: solid thin gray;
            border-radius: 50%;
            height:150px;
            width:150px;
          }
          img:hover{
            cursor: pointer;
          }
          .categories {
            margin: 60px auto;
          }
        `}
      </style>
    </div>
  );
}
