import HttpException from "./http.exceptions";

class EmailNotSendHttpException extends HttpException{
    constructor(message: string){
        super(500, message);
    }
}

export default EmailNotSendHttpException;