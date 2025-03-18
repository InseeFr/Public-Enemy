import { createMockReactOidc } from 'oidc-spa/mock/react'
import { createReactOidc } from 'oidc-spa/react'
import { z } from 'zod';

const decodedIdTokenSchema = z.object({
  name: z.string(),
  sid: z.string(),
  sub: z.string(),
});

export const { OidcProvider, useOidc, getOidc } =
  import.meta.env.VITE_AUTH_TYPE === 'oidc'
    ? createReactOidc({
      clientId: import.meta.env.VITE_OIDC_CLIENT_ID,
      issuerUri: import.meta.env.VITE_OIDC_ISSUER,
      homeUrl: import.meta.env.BASE_URL,
      decodedIdTokenSchema
    })
    : createMockReactOidc({
      isUserInitiallyLoggedIn: false,
      mockedTokens: {
        decodedIdToken: {
          sid: `mock-${self.crypto.randomUUID()}`,
          sub: 'mock-sub',
          name: 'mock-user',
        } satisfies z.infer<typeof decodedIdTokenSchema>,
      },
      homeUrl: import.meta.env.BASE_URL || '/',
    })
