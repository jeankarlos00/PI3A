import TypeSessionDTO from "./type.session.dto";

export default class SessionsDTO {

    public id?: string;
    public type?: TypeSessionDTO;
    public description?: string;
    public iat?: number;
    public expiresIn?: number;
}