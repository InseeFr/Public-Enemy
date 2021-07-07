export const parameters = {
  DataFileTypeName: { papi: "xml", cawi: "xml", capi: "json",  cawiv2: "xml" },
  DataFileType: { papi: "text/xml", cawi: "text/xml", capi: "application/json",  cawiv2: "application/json" },
  ModelFileTypeName: { papi: "fo", cawi: "xhtml", capi: "json", cawiv2: "json" },
  ModelFileType: { papi: ".fo", cawi: "application/xhtml+xml", capi: "application/json", cawiv2: "application/json" },
  VizualisationPath: { papi: '/survey-papi', cawi: '/survey-cawi-capi', capi: '/survey-capi', cawiv2: '/survey-cawiv2' },
  DataPath: { papi: '/perso-papi', cawi: '/perso-cawi-capi', capi: '/perso-capi', cawiv2: '/perso-cawiv2' },
};



export const pathCawiCati = '/survey-cawi-capi';

export const pathPapi = '/survey-papi';

export const pathPersoPapi = '/perso-papi';

export const pathPersoCawiCati = '/perso-cawi-capi';