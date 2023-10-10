export class RequestError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'RequestError'; // Set the name property for better identification
      Object.setPrototypeOf(this, RequestError.prototype); // Ensure instanceof works correctly
    }
}