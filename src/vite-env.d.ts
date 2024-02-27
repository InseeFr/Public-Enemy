/// <reference types="vite/client" />

// When we getEnvVar("XXX"), XXX is typed by these keys
interface envKeys {
  readonly VITE_API_URL: string;
  readonly VITE_ORCHESTRATOR_URL: string;
  readonly VITE_POGUES_URL: string;
  readonly VITE_DOCUMENTATION_URL: string;
  readonly VITE_LOCALE: LocaleType;
  readonly VITE_AUTH_TYPE: "none" | "oidc";
  readonly VITE_AUTH_URL: string;
  readonly VITE_REALM: string;
  readonly VITE_CLIENT_ID: string;
  readonly VITE_AUTH_TOKEN_FIELD: oidcTokensFieldString;
}
// Overload ImportMetaEnv for vite, when we use import.meta.env.XXX, XXX is typed by envKeys and dafault vite env variable.
interface ImportMetaEnv extends Readonly<Record<string, string>>, envKeys {}

// When we use window._env_ in code, you have access to envKeys (autocompletion)
interface Window {
  _env_?: ImportMetaEnv;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
