const basePath = `${window.location.origin}`;

const getFile = (url: string) => fetch(url).then((r) => r.json());

export const getConfiguration = () => getFile(`${basePath}/configuration.json`);
