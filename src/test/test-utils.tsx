import { ThemeProvider } from "@emotion/react";
import { render, RenderOptions } from "@testing-library/react";
import { getMessages, LocaleType } from "core/i18n/messages";
import { NotifierProvider } from "core/infrastructure/Notifier";
import { getEnvVar } from "core/utils/env";
import { SnackbarProvider } from "notistack";
import React, { ReactElement } from "react";
import { IntlProvider } from "react-intl";
import { QueryClient, QueryClientProvider } from "react-query";
import { appTheme } from "ui/theme";
import { vi } from "vitest";

let locale: LocaleType = "en";
const queryClient = new QueryClient();
if (getEnvVar("VITE_LOCALE")) {
  locale = getEnvVar("VITE_LOCALE");
}

const notifySpy = vi.fn();

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider theme={appTheme}>
      <QueryClientProvider client={queryClient}>
        <IntlProvider messages={getMessages(locale)} locale={locale}>
          <SnackbarProvider maxSnack={3}>
            <NotifierProvider notify={notifySpy}>{children}</NotifierProvider>
          </SnackbarProvider>
        </IntlProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

const renderWithProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { renderWithProviders, notifySpy };
