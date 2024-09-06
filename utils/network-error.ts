export default class NetworkError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public params?: Record<string, string[]>
  ) {
    super(message);

    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}
