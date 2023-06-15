import { ThemeProvider } from "@emotion/react";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { CssBaseline } from "@mui/material";
import { getMessages, LocaleType } from "core/i18n/messages";
import { getConfiguration } from "core/utils/configuration";
import { getEnvVar } from "core/utils/configuration/env";
import { SnackbarProvider } from "notistack";
import React from "react";
import ReactDOM from "react-dom/client";
import { IntlProvider } from "react-intl";
import { QueryClient, QueryClientProvider } from "react-query";
import reportWebVitals from "../reportWebVitals";
import { Application } from "./root/Application";
import { appTheme } from "./theme";

/* /!\ used in production mode where env config is used after build time
       should not be used in docker environment 
*/
await getConfiguration()
  .then((conf) => {
    if (Object.keys(conf).length) {
      console.log("plop");
      window._env_ = conf;
    }
  })
  .catch((e) => {
    console.log(e);
  });

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

let locale: LocaleType = "en";
if (getEnvVar("VITE_LOCALE")) {
  locale = getEnvVar("VITE_LOCALE");
}

/*(async () => {
  const { messages } = await import(`/i18n-${locale}.js`);
*/
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={appTheme}>
        <IntlProvider messages={getMessages(locale)} locale={locale}>
          <SnackbarProvider maxSnack={3}>
            <CssBaseline />
            <Application />
          </SnackbarProvider>
        </IntlProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
); /*
})();*/

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
