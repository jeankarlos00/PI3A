import HttpException from "./http.exceptions";

class DatabaseHttpException extends HttpException{
    constructor(message: string){
        super(500,`Database error: ${message}`)
    }
}

export default DatabaseHttpException;