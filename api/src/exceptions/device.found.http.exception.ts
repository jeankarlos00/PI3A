import HttpException from "./http.exceptions";

export default class DeviceFoundHttpException extends HttpException{
    constructor(id: string){
        super(403,`Device with this id ${id} already exists`)
    }
}