import HttpException from "./http.exceptions";

class EmailFoundHttpException extends HttpException{
    constructor(email: string){
        super(403,`Client with email ${email} already exists`)
    }
}

export default EmailFoundHttpException;