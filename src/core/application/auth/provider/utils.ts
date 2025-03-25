import { getOidc } from "./component"

export async function getAccessToken() {
    const oidc = await getOidc()

    if (!oidc.isUserLoggedIn) {
        return ''
    }
    return oidc.getTokens().accessToken
}