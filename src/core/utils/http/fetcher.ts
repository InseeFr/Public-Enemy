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
export const getRequest =
  <ResponseType>(url: string) =>
  (token?: string) =>
    simpleFetch<ResponseType>(url, "GET", undefined, token);

/**
 * Generic HTTP POST Request
 * @param url endpoint for request
 * @param payload
 * @returns promise of ResponseType
 */
export const postRequest =
  <ResponseType>(url: string, payload: object) =>
  (token?: string) =>
    simpleFetch<ResponseType>(url, "POST", payload, token);

/**
 * Generic HTTP DELETE Request
 * @param url endpoint for request
 * @returns
 */
export const deleteRequest =
  <ResponseType>(url: string) =>
  (token?: string) =>
    simpleFetch<ResponseType>(url, "DELETE", undefined, token);

/**
 * Generic HTTP PUT Request
 * @param url endpoint for request
 * @param payload
 * @returns promise of ResponseType
 */
export const putRequest =
  <ResponseType>(url: string, payload: object | undefined) =>
  (token?: string) =>
    simpleFetch<ResponseType>(url, "PUT", payload, token);

/**
 * Generic HTTP PATCH Request
 * @param url endpoint for request
 * @param payload
 * @returns promise of ResponseType
 */
export const patchRequest =
  <ResponseType>(url: string, payload: object) =>
  (token?: string) =>
    simpleFetch<ResponseType>(url, "PATCH", payload, token);

/**
 * Generic HTTP POST Request with multipart data
 * @param url endpoint for request
 * @param payload
 * @returns promise of ResponseType
 */
export const postRequestMultiPart =
  <ResponseType>(url: string, payload: FormData) =>
  (token?: string) =>
    multipartFetch<ResponseType>(url, "POST", payload, token);

/**
 * Generic HTTP PUT Request with multipart data
 * @param url endpoint for request
 * @param payload
 * @returns promise of ResponseType
 */
export const putRequestMultiPart =
  <ResponseType>(url: string, payload: FormData) =>
  (token?: string) =>
    multipartFetch<ResponseType>(url, "PUT", payload, token);

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
  payload: object | undefined,
  token?: string
): Promise<ResponseType> => {
  let headers: HeadersInit = {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json",
  };
  if (token) {
    headers = { ...headers, Authorization: `Bearer ${token}` };
  }

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
  payload: FormData,
  token?: string
): Promise<ResponseType> => {
  let headers = {};
  if (token) {
    headers = { ...headers, Authorization: `Bearer ${token}` };
  }
  return fetcher<ResponseType>(url, method, headers, payload);
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

const getFilenameFromHeader = (header: string | null): string => {
  if (header) {
    const res = /filename="(.*)"/.exec(header);
    return res && res.length > 0 ? res[1] : "default.csv";
  }
  return "default.csv";
};

export const fetcherFile = async (url: string, token?: string) => {
  const response = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    method: "GET",
  });
  const { ok, headers } = response;
  if (ok) {
    try {
      const blob = await response.blob();
      const file = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = file;
      a.download = getFilenameFromHeader(headers.get("Content-disposition"));
      a.click();
      a.remove();
    } catch (error) {
      return resolveErrors(response);
    }
  }
  // network error
  return resolveErrors(response);
};
