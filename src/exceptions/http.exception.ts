export default class HttpException extends Error {
  public statusCode: number;

  constructor(error: string | undefined, statusCode: number) {
    super(error);
    this.statusCode = statusCode;
  }
}
