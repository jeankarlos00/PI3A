import HttpException from "./http.exceptions";

class HashHttpException extends HttpException{
    message: string;
    constructor(message: string){
        super(500,`Failed to hash: ${message}`)
    }
}

export default HashHttpException;