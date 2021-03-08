//Styles
import "../styles/globals.css";
//Framework
import {useState} from 'react'
import { parseCookies } from "nookies";
import Router from "next/router";
import { getLoggedUser } from '../Api/logged_user'
//Components
import Nav from "../Components/Navbar/Nav";
import Footer from "../Components/Footer/Footer";
import WrraperApp from "../Components/Wrapper_app";

function MyApp({ Component, pageProps, session }) {
  const [LDTheme, setLDTheme] = useState(false)

  return (
    <>
      <WrraperApp session={session} LDTheme={LDTheme}>
        <Nav setLDTheme={setLDTheme}/>
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
            position: relative;
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
  
  let sessionUp = null
  if(session){
    const parsed = JSON.parse(session)
    let user = await getLoggedUser(parsed.jwt, parsed.user.id)
    sessionUp = {user: user, jwt: parsed.jwt}
  }

  if (!session) {
    if (ctx.pathname === "/perfil/modificar" || ctx.pathname === "/perfil/proveedor/modificar") {
      redirectUser(ctx, "/login");
    }
  } else {
    if (ctx.pathname === "/sesion" || ctx.pathname === "/sesion/registrar") {
      redirectUser(ctx, "/");
    }

    if(ctx.pathname === "/admin" && sessionUp?.user.role.id!==2){
      redirectUser(ctx, "/");
    }

    if(ctx.pathname === "/proveedor" && sessionUp?.user.type!==2){
      redirectUser(ctx, "/");
    }
  }

  // Destroy
  // nookies.destroy(ctx, 'cookieName')

  return { pageProps, session: sessionUp };
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
