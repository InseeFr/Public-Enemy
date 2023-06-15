export const getEnvVar = (key: string) =>
  window?._env_?.[key] || import.meta.env[key];
