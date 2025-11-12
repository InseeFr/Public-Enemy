import { InterrogationsData, InterrogationsMessages } from "core/application/model";
import { InterrogationRepositoryPort } from "core/application/port";
import { getRequest } from "core/utils/http";
import {
  fetcherFile,
  postRequestMultiPart,
  putRequest,
} from "core/utils/http/fetcher";

/**
 * Get Interrogation Repository
 * @param apiUrl interrogation CRUD API URL
 * @returns interrogation repository
 */
export function createInterrogationRepository(
  apiUrl: string,
  token?: string
): InterrogationRepositoryPort {
  const getInterrogationsData = (
    questionnaireId: number,
    modeName: string
  ): Promise<InterrogationsData> => {
    return getRequest<InterrogationsData>(
      `${apiUrl}/questionnaires/${questionnaireId}/modes/${modeName}/interrogations`
    )(token);
  };

  const checkInterrogationsCSV = (
    poguesId: string,
    interrogationCSVData: File
  ): Promise<InterrogationsMessages> => {
    const formData = new FormData();
    formData.append("interrogationData", interrogationCSVData);

    return postRequestMultiPart<InterrogationsMessages>(
      `${apiUrl}/questionnaires/${poguesId}/checkdata`,
      formData
    )(token);
  };
  const resetInterrogation = (interrogationId: string): Promise<void> => {
    return putRequest<void>(
      `${apiUrl}/interrogations/${interrogationId}/reset`,
      undefined
    )(token);
  };

  const getInterrogationsSchemaCSV = (poguesId: string): Promise<void> => {
    return fetcherFile(`${apiUrl}/questionnaires/${poguesId}/csv`, token);
  };

  const getExistingInterrogationsSchemaCSV = (id: number): Promise<void> => {
    return fetcherFile(`${apiUrl}/questionnaires/${id}/data`, token);
  };

  return {
    getInterrogationsData,
    checkInterrogationsCSV,
    resetInterrogation,
    getInterrogationsSchemaCSV,
    getExistingInterrogationsSchemaCSV,
  };
}
