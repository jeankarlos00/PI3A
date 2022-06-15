import HttpException from "./http.exceptions";

class NotFoundHttpException extends HttpException{
    constructor(type: string,message?: string){
        super(401,`${type} Not Found! `+ (message ?? ""))
}
}

export default NotFoundHttpException;