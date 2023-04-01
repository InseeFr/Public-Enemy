import { ApiError } from ".";

export class ApiErrorDetails<ErrorDetailsObject = unknown> extends ApiError {
  details: ErrorDetailsObject;

  constructor(
    code: number,
    path: string,
    message: string,
    details: ErrorDetailsObject
  ) {
    super(code, path, message);
    this.name = "ApiErrorDetails";
    this.details = details;
  }
}
