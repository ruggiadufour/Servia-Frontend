//Styles
import "../styles/globals.css";
//Framework
import { parseCookies } from "nookies";
import Router from "next/router";
//Components
import Nav from "../Components/Navbar/Nav";
import Footer from "../Components/Footer";
import WrraperApp from "../Components/Wrapper_app";

function MyApp({ Component, pageProps, session }) {
  return (
    <>
      <WrraperApp session={session}>
        <Nav />
        <div className="content">
          <Component {...pageProps} />
        </div>
        <Footer />
      </WrraperApp>
      <style jsx>
        {`
          .content {
            flex: 1;
            height: 100%;
            flex-basis: fill;
            display: flex;
            flex-direction: column;
            justify-content: center;
            margin: auto;
            width: 100%;
          }
        `}
      </style>
    </>
  );
}

MyApp.getInitialProps = async ({ Component, ctx }) => {
  let pageProps = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }

  const session = parseCookies(ctx).session;

  let getSession = null
  if(session){
    getSession = JSON.parse(session)
  }
  

  if (!session) {
    if (ctx.pathname === "/perfil/modificar" || ctx.pathname === "/perfil/proveedor/modificar") {
      redirectUser(ctx, "/login");
    }
  } else {
    if (ctx.pathname === "/sesion" || ctx.pathname === "/sesion/registrar") {
      redirectUser(ctx, "/");
    }
   
  }

  // Destroy
  // nookies.destroy(ctx, 'cookieName')

  return { pageProps, session: getSession };
};

function redirectUser(ctx, location) {
  if (ctx.req) {
    ctx.res.writeHead(302, { Location: location });
    ctx.res.end();
  } else {
    Router.push(location);
  }
}

export default MyApp;
