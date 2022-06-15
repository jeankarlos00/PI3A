import HttpException from "./http.exceptions";

class ServerErrorHttpException extends HttpException{
    constructor(message: string){
        super(500,`Server error: ${message}`)
}
}

export default ServerErrorHttpException;