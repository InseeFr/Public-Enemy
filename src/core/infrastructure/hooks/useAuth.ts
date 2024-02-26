import {
  AuthContext,
  authType,
} from "core/application/auth/provider/component";
import { createUseOidc } from "oidc-spa/react";
import { useContext, useMemo } from "react";

export const { useOidc } = createUseOidc();

export const useAuth = () => {
  if (authType === "oidc") {
    const oidc = useOidc();
    return { oidc };
  } else {
    const dummyClient = useContext(AuthContext);
    return { oidc: dummyClient };
  }
};

export const useUser = () => {
  const { oidc } = useAuth();

  if (!oidc.isUserLoggedIn) {
    throw new Error("This hook should be used only on authenticated routes");
  }

  const { decodedIdToken } = oidc.oidcTokens;

  const user = useMemo(() => {
    if (authType === "oidc") return decodedIdToken;
    return { preferred_username: null, sub: "", timbre: "", name: "Fake User" };
  }, [decodedIdToken]);

  return { user };
};
