//State providers
import { ProviderUserState } from "../States/User";
import { ProviderAlertState } from "../States/Alert";

//Styles
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import themejson from "../styles/theme.json";
import ThemeClasses from "../styles/Theme";

import Layout from '../Components/Layout'
const theme = createMuiTheme(themejson.light);

export default function WrapperApp({children, session}) {
  return (
    <div className="main-container">
      <ThemeClasses theme={theme}>
        <ProviderUserState session={session}>
          <ProviderAlertState>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Layout>
              {children}
              </Layout>
            </ThemeProvider>
          </ProviderAlertState>
        </ProviderUserState>
      </ThemeClasses>
    </div>
  );
}
