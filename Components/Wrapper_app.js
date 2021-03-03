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

const dark = createMuiTheme(themejson.light);
const light = createMuiTheme(themejson.dark);

export default function WrapperApp({children, session, LDTheme}) {
  return (
    <div className="main-container">
      <ThemeClasses theme={LDTheme?dark:light}>
        <ProviderUserState session={session}>
          <ProviderAlertState>
            <ThemeProvider theme={LDTheme?dark:light}>
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
