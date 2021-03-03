import { useRouter } from "next/router";
//Material UI
import { Typography, Grid } from "@material-ui/core/";

export default function Home({ categories }) {
  const router = useRouter();

  function searchProfiles(id, name) {
    router.push("/perfiles?category_id=" + id + "&is_profile=true");
  }

  return (
    <div className="general-width categories">
      <Typography component="h2" variant="h4" align="left">
        Mirá los perfiles de nuestros profesionales seleccionado la categoría
        del servicio que buscás.
      </Typography>
      <div className="all">
        <Grid container spacing={5} justify="space-around" alignItems="center">
          {categories.map((cat, i) => {
            let API = process.env.NEXT_PUBLIC_API;
            let image = cat.image?.formats?.small?.url?(API+cat.image?.formats?.small?.url):"/Icono3.png"

            return <Grid item sm={4} md={3} lg={2} key={i} align="center">
              <Typography align="center" variant="body1">
                {cat.name}
              </Typography>

              <img
                src={ image }
                height="150px"
                width="150px"
                className="circle-image"
                onClick={() => {
                  searchProfiles(cat.id, cat.name);
                }}
              />
            </Grid>;
          })}
        </Grid>
      </div>

      <style jsx>
        {`
          .all {
            margin-top: 25px;
          }
          img:hover {
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
