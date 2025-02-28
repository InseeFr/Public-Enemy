
import { createMockReactOidc } from "oidc-spa/mock/react";
import { createReactOidc } from "oidc-spa/react";


export const { OidcProvider, useOidc, getOidc } =
  import.meta.env.VITE_AUTH_TYPE === "oidc"
    ? createReactOidc({
      clientId: import.meta.env.VITE_CLIENT_ID,
      issuerUri: import.meta.env.VITE_REALM,
      homeUrl: import.meta.env.VITE_BASE_URL,
    })
    : createMockReactOidc({
      isUserInitiallyLoggedIn: false,
      mockedTokens: {
        decodedIdToken: {
          sid: `mock-${self.crypto.randomUUID()}`,
          sub: "mock-sub",
          preferred_username: "mock-user",
        },
      },
      homeUrl: import.meta.env.VITE_BASE_URL,
    });
