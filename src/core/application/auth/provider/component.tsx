import { createMockReactOidc } from 'oidc-spa/mock/react'
import { createReactOidc } from 'oidc-spa/react'


export const { OidcProvider, useOidc, getOidc } =
  import.meta.env.VITE_AUTH_TYPE === 'oidc'
    ? createReactOidc({
      clientId: import.meta.env.VITE_OIDC_CLIENT_ID,
      issuerUri: import.meta.env.VITE_OIDC_ISSUER,
      homeUrl: import.meta.env.BASE_URL || '/',
    })
    : createMockReactOidc({
      isUserInitiallyLoggedIn: false,
      mockedTokens: {
        decodedIdToken: {
          sid: `mock-${self.crypto.randomUUID()}`,
          sub: 'mock-sub',
          preferred_username: 'mock-user',
        },
      },
      homeUrl: import.meta.env.BASE_URL || '/',
    })
