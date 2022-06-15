import HttpData from "../interfaces/http.data.interface";

class HttpException extends Error {
    status: number;
    message: string;
    data: HttpData;
    constructor(status: number, message: string, ok = false) {
      super(message);
      this.status = status;
      this.message = message;
      this.data = {
          ok: ok,
          message: message
      }
    }
  }
  
export default HttpException;