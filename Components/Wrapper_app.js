import { useEffect, useContext } from "react";

const theme = createMuiTheme(themejson.light);
import { ProviderUserState } from "../States/User";
import { ProviderAlertState } from "../States/Alert";

import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import themejson from "../styles/theme.json";
import ThemeClasses from "../styles/Theme";

export default function WrapperApp({children, session}) {
  return (
    <div className="main-container">
      <ThemeClasses theme={theme}>
        <ProviderUserState session={session}>
          <ProviderAlertState>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              {children}
            </ThemeProvider>
          </ProviderAlertState>
        </ProviderUserState>
      </ThemeClasses>
    </div>
  );
}
