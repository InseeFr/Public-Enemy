import React from 'react'

import { ThemeProvider } from '@emotion/react'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { CssBaseline } from '@mui/material'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { OidcProvider } from 'core/application/auth/provider/component'
import { LocaleType, getMessages } from 'core/i18n/messages'
import { getEnvVar } from 'core/utils/configuration/env'
import { SnackbarProvider } from 'notistack'
import ReactDOM from 'react-dom/client'
import { IntlProvider } from 'react-intl'

import reportWebVitals from '../reportWebVitals'
import { Application } from './root/Application'
import { appTheme } from './theme'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
})

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

let locale: LocaleType = 'en'
if (getEnvVar('VITE_LOCALE')) {
  locale = getEnvVar('VITE_LOCALE')
}

/*(async () => {
  const { messages } = await import(`/i18n-${locale}.js`);
*/
root.render(
  <React.StrictMode>
    <OidcProvider>
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
    </OidcProvider>
  </React.StrictMode>,
) /*
})();*/

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
