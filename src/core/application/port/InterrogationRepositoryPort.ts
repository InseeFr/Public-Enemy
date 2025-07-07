import { InterrogationsData, InterrogationsMessages } from "../model";

export type InterrogationRepositoryPort = {
  getInterrogationsData: (
    id: number,
    modeName: string
  ) => Promise<InterrogationsData>;

  checkInterrogationsCSV: (
    poguesId: string,
    interrogationData: File
  ) => Promise<InterrogationsMessages>;

  getInterrogationsSchemaCSV: (poguesId: string) => Promise<void>;
  getExistingInterrogationsSchemaCSV: (id: number) => Promise<void>;

  resetInterrogation: (interrogationId: string) => Promise<void>;
};
