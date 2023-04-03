import {
  ApiError,
  ApiErrorDetails,
  ErrorDetails,
  ErrorDetailsSurveyUnit,
  ErrorObject,
} from "core/application/model/error";

/**
 * Generic HTTP Get Request
 * @param url endpoint for request
 * @returns promise of ResponseType
 */
export const getRequest = <ResponseType>(url: string) =>
  simpleFetch<ResponseType>(url, "GET", undefined);

/**
 * Generic HTTP POST Request
 * @param url endpoint for request
 * @param payload
 * @returns promise of ResponseType
 */
export const postRequest = <ResponseType>(url: string, payload: object) =>
  simpleFetch<ResponseType>(url, "POST", payload);

/**
 * Generic HTTP DELETE Request
 * @param url endpoint for request
 * @returns
 */
export const deleteRequest = <ResponseType>(url: string) =>
  simpleFetch<ResponseType>(url, "DELETE", undefined);

/**
 * Generic HTTP PUT Request
 * @param url endpoint for request
 * @param payload
 * @returns promise of ResponseType
 */
export const putRequest = <ResponseType>(url: string, payload: object) =>
  simpleFetch<ResponseType>(url, "PUT", payload);

/**
 * Generic HTTP PATCH Request
 * @param url endpoint for request
 * @param payload
 * @returns promise of ResponseType
 */
export const patchRequest = <ResponseType>(url: string, payload: object) =>
  simpleFetch<ResponseType>(url, "PATCH", payload);

/**
 * Generic HTTP POST Request with multipart data
 * @param url endpoint for request
 * @param payload
 * @returns promise of ResponseType
 */
export const postRequestMultiPart = <ResponseType>(
  url: string,
  payload: FormData
) => multipartFetch<ResponseType>(url, "POST", payload);

/**
 * Generic HTTP PUT Request with multipart data
 * @param url endpoint for request
 * @param payload
 * @returns promise of ResponseType
 */
export const putRequestMultiPart = <ResponseType>(
  url: string,
  payload: FormData
) => multipartFetch<ResponseType>(url, "PUT", payload);

/**
 * Generic simple fetch request
 * @param url endpoint for request
 * @param method HTTP method
 * @param payload
 * @returns promise of ResponseType
 */
const simpleFetch = <ResponseType>(
  url: string,
  method: "GET" | "POST" | "PATCH" | "DELETE" | "PUT",
  payload: object | undefined
): Promise<ResponseType> => {
  const headers: HeadersInit = {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json",
  };

  let payloadJson = undefined;
  if (payload !== undefined) {
    payloadJson = JSON.stringify(payload);
  }

  return fetcher<ResponseType>(url, method, headers, payloadJson);
};

/**
 * Generic fetch request with multipart data
 * @param url endpoint for request
 * @param method HTTP method
 * @param payload
 * @returns promise of ResponseType
 */
const multipartFetch = <ResponseType>(
  url: string,
  method: "POST" | "PATCH" | "PUT",
  payload: FormData
): Promise<ResponseType> => {
  return fetcher<ResponseType>(url, method, undefined, payload);
};

/**
 * GLobal generic fetcher
 * @param url endpoint for request
 * @param method HTTP method
 * @param headers headers for the request
 * @param payload
 * @returns promise of ResponseType
 */
const fetcher = <ResponseType>(
  url: string,
  method: string,
  headers: HeadersInit | undefined,
  payload: string | FormData | undefined
): Promise<ResponseType> => {
  return fetch(url, {
    headers: headers,
    method,
    body: payload,
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }
    return resolveErrors(response);
  });
};

const resolveErrors = async (response: Response) => {
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") == -1) {
    throw new ApiError(response.status, response.url, await response.text());
  }

  return response.json().then((errObject: ErrorObject) => {
    switch (errObject.code) {
      // survey global validations error
      case 1001: {
        const errObjectDetails = errObject as ErrorDetails<string[]>;
        throw new ApiErrorDetails<string[]>(
          errObjectDetails.code,
          errObjectDetails.path,
          errObjectDetails.message,
          errObjectDetails.details
        );
      }
      // survey specific validations error
      case 1002: {
        const errObjectDetails = errObject as ErrorDetails<
          ErrorDetailsSurveyUnit[]
        >;
        throw new ApiErrorDetails<ErrorDetailsSurveyUnit[]>(
          errObjectDetails.code,
          errObjectDetails.path,
          errObjectDetails.message,
          errObjectDetails.details
        );
      }
      default:
        throw new ApiError(errObject.code, errObject.path, errObject.message);
    }
  });
};
