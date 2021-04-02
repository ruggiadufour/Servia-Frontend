import { useRouter } from "next/router";
import DefaultErrorPage from "next/error";
import Head from "next/head";
import Meta from "../../Components/Meta";
//Material-UI
import { Grid } from "@material-ui/core/";

import { getPublication } from "../../Api/publications";
import MainData from "../../Components/Publication/MainData";
import ProfileOwner from "../../Components/Publication/ProfileOwner";
import Contact from '../../Components/ContactProvider'

export default function Publicacion({ publication }) {
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API;

  // if isFallback means that the route is not generated statically
  if (router.isFallback) {
    return <h2>Cargando...</h2>;
  }

  // This includes setting the noindex header because static files always return a status 200 but the rendered not found page page should obviously not be indexed
  if (!publication) {
    return (
      <>
        <Head>
          <meta name="robots" content="noindex" />
        </Head>
        <DefaultErrorPage statusCode={404} />
      </>
    );
  }

  function getImage() {
    if (publication.images.length !== 0) {
      return API + publication.images[0].url;
    } else {
      return null;
    }
  }

  return (
    <>
      <Meta
        title={publication.title}
        desc={publication.description}
        canonical={`https://servia.ar/publicaciones/${publication.id}`}
        image={getImage()}
        keywords={`publicacion de servia, servicio doméstico, proveedor de srevicios, ${publication.title}, ${publication.category.name}`}
      />
      <div className="general-width p-15 centering">
        <Contact
          isFixed={true}
          profile={publication.public_user}
          type={publication.type ? 1 : 2}
        />

        <Grid container direction="row" justify="center" alignItems="stretch">
          <Grid item md={8} xs={12}>
            <MainData publication={publication} />
          </Grid>

          <Grid item md={4} xs={12}>
            <ProfileOwner profile={publication.public_user} />
          </Grid>
        </Grid>
        <style jsx>
          {`
            div {
              margin: 15px auto;
              position: relative;
            }
          `}
        </style>
      </div>
    </>
  );
}
// export async function getStaticPaths() {
//   const data = await getPublications();

//   const paths = data.map((post) => ({
//     params: { postId: post.id.toString() },
//   }));

//   // We'll pre-render only these paths at build time.
//   // { fallback: false } means other routes should 404.
//   return { paths, fallback: true };
// }

export async function getServerSideProps({ params }) {
  const data = await getPublication(params.postId);

  //revalidate: 300,
  return {
    props: {
      publication: data,
    },
  };
}
