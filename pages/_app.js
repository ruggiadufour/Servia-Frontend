import "../styles/globals.css";
import { useEffect } from "react";
import Nav from "../Components/Navbar/Nav";
import Footer from "../Components/Footer";
import { ProvideFilterState } from "../States/Filter";
import PropTypes from 'prop-types';
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import themejson from "../styles/theme.json";

import ThemeClasses from "../styles/Theme";
const theme = createMuiTheme(themejson.light);

function MyApp(props) {
  const { Component, pageProps } = props;

  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <div className="main-container">
      <ThemeClasses theme={theme}>
        <ProvideFilterState>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Nav />
            <div className="content">
              <Component {...pageProps} />
            </div>
          </ThemeProvider>
        </ProvideFilterState>
      </ThemeClasses>
      <Footer />
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
    </div>
  );
}
MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};
export default MyApp;
