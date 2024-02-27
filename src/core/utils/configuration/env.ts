export const getEnvVar = <K extends keyof envKeys>(key: K): envKeys[K] =>
  window._env_?.[key] ?? import.meta.env[key];
