import { getEnvVar } from "core/utils/configuration";
import { createOidcProvider } from "oidc-spa/react";
import React from "react";

export const authType = getEnvVar("VITE_AUTH_TYPE");
export const oidcConf = {
  authUrl: getEnvVar("VITE_AUTH_URL"),
  realm: getEnvVar("VITE_REALM"),
  client_id: getEnvVar("VITE_CLIENT_ID"),
};

const LoaderSimple = () => <div>Loading</div>;

const dummyOidcClient = {
  isUserLoggedIn: true,
  login: () => console.log("You're loggin"),
  logout: () => (window.location.href = "/"),
  oidcTokens: {
    accessToken: undefined,
    decodedIdToken: undefined,
    idToken: undefined,
    refreshToken: undefined,
    refreshTokenExpirationTime: undefined,
    accessTokenExpirationTime: undefined,
  },
};

const { authUrl, realm, client_id } = oidcConf;

export const AuthContext = React.createContext(dummyOidcClient);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  if (authType === "oidc") {
    const { OidcProvider } = createOidcProvider({
      issuerUri: `${authUrl}/realms/${realm}`,
      clientId: client_id,
      // See above for other parameters
    });
    return <OidcProvider fallback={<LoaderSimple />}>{children}</OidcProvider>;
  }

  return (
    <AuthContext.Provider value={dummyOidcClient}>
      {children}
    </AuthContext.Provider>
  );
}
