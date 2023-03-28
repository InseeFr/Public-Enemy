export class ApiError extends Error {
  path: string;
  code: number;

  constructor(code: number, path: string, message: string) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.path = path;
  }
}
