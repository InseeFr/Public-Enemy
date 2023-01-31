import { ThemeProvider } from "@emotion/react";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { CssBaseline } from "@mui/material";
import { getMessages, LocaleType } from "core/i18n/messages";
import { SnackbarProvider } from "notistack";
import React from "react";
import ReactDOM from "react-dom/client";
import { IntlProvider } from "react-intl";
import reportWebVitals from "../reportWebVitals";
import { Application } from "./root/Application";
import { appTheme } from "./theme";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

let locale: LocaleType = "en";
if (process.env.REACT_APP_LOCALE) {
  locale = process.env.REACT_APP_LOCALE;
}

/*(async () => {
  const { messages } = await import(`/i18n-${locale}.js`);
*/
root.render(
  <React.StrictMode>
    <ThemeProvider theme={appTheme}>
      <IntlProvider messages={getMessages(locale)} locale={locale}>
        <SnackbarProvider maxSnack={3}>
          <CssBaseline />
          <Application />
        </SnackbarProvider>
      </IntlProvider>
    </ThemeProvider>
  </React.StrictMode>
); /*
})();*/

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
